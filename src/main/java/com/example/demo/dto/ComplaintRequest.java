package com.example.demo.dto;

import com.example.demo.entities.ComplaintCategory;
import com.example.demo.entities.ComplaintPriority;
import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
public class ComplaintRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    @NotBlank
    private String location;
    
    @NotNull
    private ComplaintCategory category;
    
    @NotNull
    private ComplaintPriority priority;
}
