package com.fyp.fyp.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

import com.fyp.fyp.model.Enum.UserRole;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
    
    @Column(unique = true, nullable = false, length = 50)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(unique = true)
    private String phone;
    
    @Column(nullable = false)
    private LocalDateTime createTime;
    
    private LocalDateTime lastLoginTime;
} 