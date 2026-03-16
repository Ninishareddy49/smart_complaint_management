package com.example.demo.controllers;

import com.example.demo.dto.AnalyticsDto;
import com.example.demo.dto.UserDto;
import com.example.demo.entities.ComplaintStatus;
import com.example.demo.entities.RoleType;
import com.example.demo.repositories.ComplaintRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(user -> new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getCreatedAt()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/staff")
    public ResponseEntity<List<UserDto>> getAllStaff() {
        List<UserDto> staff = userRepository.findAll().stream()
                .filter(user -> user.getRole() == RoleType.ROLE_STAFF)
                .map(user -> new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getCreatedAt()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(staff);
    }

    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsDto> getAnalytics() {
        long total = complaintRepository.count();
        long open = complaintRepository.countByStatus(ComplaintStatus.OPEN) + complaintRepository.countByStatus(ComplaintStatus.ASSIGNED) + complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS);
        long resolved = complaintRepository.countByStatus(ComplaintStatus.RESOLVED) + complaintRepository.countByStatus(ComplaintStatus.CLOSED);

        return ResponseEntity.ok(new AnalyticsDto(total, open, resolved));
    }
}
