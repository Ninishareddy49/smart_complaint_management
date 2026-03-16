package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AnalyticsDto {
    private long totalComplaints;
    private long openComplaints;
    private long resolvedComplaints;
    // can add other fields as needed
}
