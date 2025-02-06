package com.fyp.fyp.service;

public interface EmailService {
    void sendVerificationEmail(String to, String verificationLink);
} 