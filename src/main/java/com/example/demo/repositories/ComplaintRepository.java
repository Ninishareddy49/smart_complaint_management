package com.example.demo.repositories;

import com.example.demo.entities.Complaint;
import com.example.demo.entities.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Complaint> findByAssignedStaffIdOrderByCreatedAtDesc(Long staffId);
    List<Complaint> findByAssignedStaffNullOrAssignedStaffIdOrderByCreatedAtDesc(Long staffId);
    List<Complaint> findAllByOrderByCreatedAtDesc();
    long countByStatus(ComplaintStatus status);
    long countByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, ComplaintStatus status);
    long countByAssignedStaffId(Long staffId);
    long countByAssignedStaffIdNull();
    long countByAssignedStaffIdNullAndStatus(ComplaintStatus status);
    long countByAssignedStaffIdAndStatus(Long staffId, ComplaintStatus status);
}
