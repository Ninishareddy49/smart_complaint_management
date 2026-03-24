package com.example.demo.controllers;

import com.example.demo.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<?> getNotifications(Authentication authentication) {
        return ResponseEntity.ok(notificationService.getNotificationsByUser(authentication.getName()));
    }

    @org.springframework.web.bind.annotation.PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@org.springframework.web.bind.annotation.PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(new com.example.demo.dto.MessageResponse("Notification marked as read"));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(Authentication authentication) {
        return ResponseEntity.ok(notificationService.getUnreadCountByUser(authentication.getName()));
    }
}
