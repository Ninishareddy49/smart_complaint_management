package com.example.demo.dto;

import com.example.demo.entities.RoleType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private RoleType role;
    private LocalDateTime createdAt;
}
