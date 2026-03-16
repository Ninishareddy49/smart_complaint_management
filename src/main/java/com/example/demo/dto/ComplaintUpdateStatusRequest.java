package com.example.demo.dto;

import com.example.demo.entities.ComplaintStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComplaintUpdateStatusRequest {
    private ComplaintStatus status;
    private String comment;
}
