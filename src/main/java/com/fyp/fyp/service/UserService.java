package com.fyp.fyp.service;

import com.fyp.fyp.dto.LoginRequest;
import com.fyp.fyp.dto.RegisterRequest;
import com.fyp.fyp.model.User;

public interface UserService {
    User register(RegisterRequest request);
    User login(LoginRequest request);
    void sendVerificationEmail(User user);
    void sendVerificationSms(User user);
} 