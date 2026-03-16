package com.example.demo.controllers;

import com.example.demo.dto.AssignComplaintRequest;
import com.example.demo.dto.ComplaintRequest;
import com.example.demo.dto.ComplaintUpdateStatusRequest;
import com.example.demo.services.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(Authentication authentication) {
        return ResponseEntity.ok(complaintService.getStats(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<?> createComplaint(@Valid @RequestBody ComplaintRequest request, Authentication authentication) {
        return ResponseEntity.ok(complaintService.createComplaint(request, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<?> getUserComplaints(Authentication authentication) {
        return ResponseEntity.ok(complaintService.getComplaintsByUser(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getComplaintDetails(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getComplaintById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateComplaintStatus(@PathVariable Long id, @Valid @RequestBody ComplaintUpdateStatusRequest request, Authentication authentication) {
        return ResponseEntity.ok(complaintService.updateComplaintStatus(id, request, authentication.getName()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignComplaint(@PathVariable Long id, @Valid @RequestBody AssignComplaintRequest request) {
        return ResponseEntity.ok(complaintService.assignComplaint(id, request));
    }
}
