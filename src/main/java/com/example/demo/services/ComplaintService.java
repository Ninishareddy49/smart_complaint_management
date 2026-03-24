package com.example.demo.services;

import com.example.demo.dto.*;
import com.example.demo.entities.*;
import com.example.demo.repositories.ComplaintRepository;
import com.example.demo.repositories.ComplaintUpdateRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplaintService {
    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ComplaintUpdateRepository complaintUpdateRepository;

    @Autowired
    private NotificationService notificationService;

    public ComplaintDto createComplaint(ComplaintRequest request, String userEmail) {
        AppUser user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
        
        Complaint complaint = new Complaint();
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setCategory(request.getCategory());
        complaint.setPriority(request.getPriority());
        complaint.setLocation(request.getLocation());
        complaint.setStatus(ComplaintStatus.OPEN);
        complaint.setUser(user);

        Complaint savedComplaint = complaintRepository.save(complaint);
        
        // Notify Admins about new complaint
        List<AppUser> admins = userRepository.findAll().stream()
                .filter(u -> u.getRole() == RoleType.ROLE_ADMIN)
                .collect(Collectors.toList());
        for (AppUser admin : admins) {
            notificationService.createNotification(admin, "New Complaint Submitted", 
                "A new " + complaint.getCategory() + " complaint has been submitted: " + complaint.getTitle());
        }

        return mapToDto(savedComplaint);
    }

    public List<ComplaintDto> getComplaintsByUser(String userEmail) {
        AppUser user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Complaint> complaints;
        if (user.getRole() == RoleType.ROLE_ADMIN) {
            complaints = complaintRepository.findAllByOrderByCreatedAtDesc();
        } else if (user.getRole() == RoleType.ROLE_STAFF) {
            complaints = complaintRepository.findByAssignedStaffNullOrAssignedStaffIdOrderByCreatedAtDesc(user.getId());
        } else {
            complaints = complaintRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        }

        return complaints.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public ComplaintDto getComplaintById(Long id) {
        try {
            Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + id));
            
            ComplaintDto dto = mapToDto(complaint);
            List<ComplaintUpdate> updates = complaintUpdateRepository.findByComplaintIdOrderByTimestampAsc(id);
            
            dto.setHistory(updates.stream()
                .map(this::mapUpdateToDto)
                .collect(Collectors.toList()));
            
            return dto;
        } catch (Exception e) {
            System.err.println("Error in getComplaintById: " + e.getMessage());
            throw e;
        }
    }

    public ComplaintDto updateComplaintStatus(Long id, ComplaintUpdateStatusRequest request, String userEmail) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow(() -> new RuntimeException("Complaint not found"));
        AppUser user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));

        complaint.setStatus(request.getStatus());
        
        // Auto-assign if staff updates an unassigned complaint
        if (user.getRole() == RoleType.ROLE_STAFF && complaint.getAssignedStaff() == null) {
            complaint.setAssignedStaff(user);
        }

        Complaint updatedComplaint = complaintRepository.save(complaint);

        ComplaintUpdate update = new ComplaintUpdate();
        update.setComplaint(complaint);
        update.setStatus(request.getStatus());
        update.setComment(request.getComment());
        update.setUpdatedBy(user);
        complaintUpdateRepository.save(update);

        // Notify user about status change with specific messages
        String notificationTitle = "Complaint Status Updated";
        String notificationMessage = "Your complaint '" + complaint.getTitle() + "' status has been changed to " + request.getStatus();

        if (request.getStatus() == ComplaintStatus.IN_PROGRESS) {
            notificationTitle = "Work Started on Your Complaint";
            notificationMessage = "A specialist is now working on your report: " + complaint.getTitle();
        } else if (request.getStatus() == ComplaintStatus.RESOLVED) {
            notificationTitle = "Complaint Resolved";
            notificationMessage = "Action has been completed for your report: " + complaint.getTitle() + ". Please review and close the case.";
        } else if (request.getStatus() == ComplaintStatus.CLOSED) {
            notificationTitle = "Case Finalized";
            notificationMessage = "Your case has been officially closed: " + complaint.getTitle();
        }

        notificationService.createNotification(complaint.getUser(), notificationTitle, notificationMessage);

        return mapToDto(updatedComplaint);
    }

    public ComplaintDto assignComplaint(Long id, AssignComplaintRequest request) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow(() -> new RuntimeException("Complaint not found"));
        AppUser staff = userRepository.findById(request.getStaffId()).orElseThrow(() -> new RuntimeException("Staff not found"));

        complaint.setAssignedStaff(staff);
        complaint.setStatus(ComplaintStatus.ASSIGNED);
        Complaint saved = complaintRepository.save(complaint);

        // Notify staff member
        notificationService.createNotification(staff, "New Task Assigned", 
            "You have been assigned to handle a complaint: " + complaint.getTitle());

        return mapToDto(saved);
    }

    public AnalyticsDto getStats(String userEmail) {
        AppUser user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
        
        long total, open, resolved;

        if (user.getRole() == RoleType.ROLE_ADMIN) {
            total = complaintRepository.count();
            open = complaintRepository.countByStatus(ComplaintStatus.OPEN) + 
                   complaintRepository.countByStatus(ComplaintStatus.ASSIGNED) + 
                   complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS);
            resolved = complaintRepository.countByStatus(ComplaintStatus.RESOLVED) + 
                       complaintRepository.countByStatus(ComplaintStatus.CLOSED);
        } else if (user.getRole() == RoleType.ROLE_STAFF) {
            total = complaintRepository.countByAssignedStaffId(user.getId()) + complaintRepository.countByAssignedStaffIdNull();
            open = complaintRepository.countByAssignedStaffIdAndStatus(user.getId(), ComplaintStatus.ASSIGNED) + 
                   complaintRepository.countByAssignedStaffIdAndStatus(user.getId(), ComplaintStatus.IN_PROGRESS) +
                   complaintRepository.countByAssignedStaffIdNullAndStatus(ComplaintStatus.OPEN);
            resolved = complaintRepository.countByAssignedStaffIdAndStatus(user.getId(), ComplaintStatus.RESOLVED) + 
                       complaintRepository.countByAssignedStaffIdAndStatus(user.getId(), ComplaintStatus.CLOSED);
        } else {
            total = complaintRepository.countByUserId(user.getId());
            open = complaintRepository.countByUserIdAndStatus(user.getId(), ComplaintStatus.OPEN) + 
                   complaintRepository.countByUserIdAndStatus(user.getId(), ComplaintStatus.ASSIGNED) + 
                   complaintRepository.countByUserIdAndStatus(user.getId(), ComplaintStatus.IN_PROGRESS);
            resolved = complaintRepository.countByUserIdAndStatus(user.getId(), ComplaintStatus.RESOLVED) + 
                       complaintRepository.countByUserIdAndStatus(user.getId(), ComplaintStatus.CLOSED);
        }

        return new AnalyticsDto(total, open, resolved);
    }

    private ComplaintDto mapToDto(Complaint complaint) {
        ComplaintDto dto = new ComplaintDto();
        dto.setId(complaint.getId());
        dto.setTitle(complaint.getTitle());
        dto.setDescription(complaint.getDescription());
        dto.setCategory(complaint.getCategory());
        dto.setPriority(complaint.getPriority());
        dto.setStatus(complaint.getStatus());
        dto.setLocation(complaint.getLocation());
        dto.setUserName(complaint.getUser() != null ? complaint.getUser().getName() : null);
        dto.setAssignedStaffName(complaint.getAssignedStaff() != null ? complaint.getAssignedStaff().getName() : null);
        dto.setCreatedAt(complaint.getCreatedAt());
        dto.setUpdatedAt(complaint.getUpdatedAt());
        return dto;
    }

    private ComplaintUpdateDto mapUpdateToDto(ComplaintUpdate update) {
        ComplaintUpdateDto dto = new ComplaintUpdateDto();
        dto.setId(update.getId());
        dto.setStatus(update.getStatus());
        dto.setComment(update.getComment());
        dto.setUpdatedBy(update.getUpdatedBy() != null ? update.getUpdatedBy().getName() : null);
        dto.setTimestamp(update.getTimestamp());
        return dto;
    }
}
