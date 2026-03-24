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

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            jdbcTemplate.execute("ALTER TABLE notifications DROP COLUMN is_read");
            System.out.println("Database Migration: Dropped duplicate 'is_read' column.");
        } catch (Exception e) {
            // Ignore if column doesn't exist
        }

        // Ensure Admin exists and password matches
        AppUser admin = userRepository.findByEmail("admin@scms.com").orElse(new AppUser());
        if (admin.getId() == null) {
            admin.setName("System Administrator");
            admin.setEmail("admin@scms.com");
            admin.setRole(RoleType.ROLE_ADMIN);
        }
        admin.setPasswordHash(passwordEncoder.encode("admin123"));
        userRepository.save(admin);
        System.out.println("Admin secured: admin@scms.com / admin123");

        // Ensure Staff exists
        AppUser staff = userRepository.findByEmail("staff@scms.com").orElse(new AppUser());
        if (staff.getId() == null) {
            staff.setName("Support Resolver");
            staff.setEmail("staff@scms.com");
            staff.setRole(RoleType.ROLE_STAFF);
        }
        staff.setPasswordHash(passwordEncoder.encode("staff123"));
        userRepository.save(staff);
        System.out.println("Staff secured: staff@scms.com / staff123");

        // Ensure Student exists
        AppUser student = userRepository.findByEmail("student@scms.com").orElse(new AppUser());
        if (student.getId() == null) {
            student.setName("Alex Student");
            student.setEmail("student@scms.com");
            student.setRole(RoleType.ROLE_USER);
        }
        student.setPasswordHash(passwordEncoder.encode("student123"));
        userRepository.save(student);
        System.out.println("User secured: student@scms.com / student123");
    }
}
