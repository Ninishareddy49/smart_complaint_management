package com.example.demo.dto;

import com.example.demo.entities.ComplaintStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ComplaintUpdateDto {
    private Long id;
    private ComplaintStatus status;
    private String comment;
    private String updatedBy;
    private LocalDateTime timestamp;
}
