package com.example.demo.config;

import com.example.demo.entities.AppUser;
import com.example.demo.entities.RoleType;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Create Admin
            AppUser admin = new AppUser();
            admin.setName("System Administrator");
            admin.setEmail("admin@scms.com");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole(RoleType.ROLE_ADMIN);
            userRepository.save(admin);

            // Create Staff
            AppUser staff = new AppUser();
            staff.setName("Support Resolver");
            staff.setEmail("staff@scms.com");
            staff.setPasswordHash(passwordEncoder.encode("staff123"));
            staff.setRole(RoleType.ROLE_STAFF);
            userRepository.save(staff);

            // Create Student
            AppUser student = new AppUser();
            student.setName("Alex Student");
            student.setEmail("student@scms.com");
            student.setPasswordHash(passwordEncoder.encode("student123"));
            student.setRole(RoleType.ROLE_USER);
            userRepository.save(student);

            System.out.println("Database seeded with default users.");
        }
    }
}
