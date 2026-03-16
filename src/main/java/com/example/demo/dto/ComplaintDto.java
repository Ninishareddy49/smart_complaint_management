package com.example.demo.dto;

import com.example.demo.entities.ComplaintCategory;
import com.example.demo.entities.ComplaintPriority;
import com.example.demo.entities.ComplaintStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class ComplaintDto {
    private Long id;
    private String title;
    private String description;
    private ComplaintCategory category;
    private ComplaintPriority priority;
    private ComplaintStatus status;
    private String location;
    private String userName;
    private String assignedStaffName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ComplaintUpdateDto> history;
}
