package com.fyp.fyp.service.impl;

import com.fyp.fyp.dto.RegisterRequest;
import com.fyp.fyp.dto.LoginRequest;
import com.fyp.fyp.exception.BusinessException;
import com.fyp.fyp.model.User;
import com.fyp.fyp.model.Enum.UserRole;
import com.fyp.fyp.Repository.UserRepository;
import com.fyp.fyp.service.EmailService;
import com.fyp.fyp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    
    @Override
    @Transactional
    public User register(RegisterRequest request) {
        System.out.println("register");
        // 验证用户名是否已存在
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException(409, "用户名已存在");
        }
        
        // 验证邮箱是否已存在
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(409, "邮箱已存在");
        }
        
        // 验证手机号是否已存在
        if (userRepository.existsByPhone(request.getPhoneNumber())) {
            throw new BusinessException(409, "手机号已存在");
        }
        
        // 创建用户实体
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhoneNumber());
        user.setRole(UserRole.valueOf("ROLE_" + request.getUserType()));
        user.setCreateTime(LocalDateTime.now());
        
        // 保存用户
        user = userRepository.save(user);
        
        // 发送验证邮件和短信
        //sendVerificationEmail(user);
        //sendVerificationSms(user);
        
        return user;
    }
    
    @Override
    public void sendVerificationEmail(User user) {
        String verificationLink = "http://localhost:8080/verify?token=" + generateVerificationToken(user);
        emailService.sendVerificationEmail(user.getEmail(), verificationLink);
    }
    
    private String generateVerificationToken(User user) {
        // TODO: 实现生成验证token的逻辑
        return "temporary-token";
    }
    
    @Override
    public void sendVerificationSms(User user) {
        // TODO: 实现短信发送逻辑
    }
    
    @Override
    public User login(LoginRequest request) {
        // 根据用户名查找用户
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new BusinessException(401, "用户名或密码错误"));
        
        // 验证密码
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException(401, "用户名或密码错误");
        }
        
        // 更新最后登录时间
        user.setLastLoginTime(LocalDateTime.now());
        return userRepository.save(user);
    }
} 