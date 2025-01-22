package com.fyp.fyp.controller;

import com.fyp.fyp.dto.ApiResponse;
import com.fyp.fyp.dto.RegisterRequest;
import com.fyp.fyp.exception.BusinessException;
import com.fyp.fyp.model.User;
import com.fyp.fyp.service.UserService;
import com.fyp.fyp.Repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test") // 使用测试配置文件
@Transactional // 测试完成后回滚事务
public class UserControllerTest {

    @Autowired
    private UserController userController;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testRegister_Success() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setUsername("ryan");
        request.setPassword("1617895149");
        request.setEmail("ryan@example.com");
        request.setPhoneNumber("12345678");
        request.setUserType("ADMIN");

        // Act
        ApiResponse<Long> response = userController.register(request);

        // Assert
        assertNotNull(response.getData());
        User savedUser = userRepository.findById(response.getData())
            .orElseThrow(() -> new AssertionError("User not found"));
        
        assertEquals("ryan", savedUser.getUsername());
        assertEquals("ryan@example.com", savedUser.getEmail());
        assertEquals("12345678", savedUser.getPhone());
        assertNotNull(savedUser.getCreateTime());
    }

    @Test
    public void testRegister_DuplicateUsername() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setUsername("ryan");
        request.setPassword("1617895149");
        request.setEmail("ryan@example.com");
        request.setPhoneNumber("12345678");
        request.setUserType("CUSTOMER");

        // First registration
        userController.register(request);

        // Second registration with same username
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            userController.register(request);
        });

        assertEquals(409, exception.getCode());
        assertEquals("用户名已存在", exception.getMessage());
    }

    @Test
    public void testRegister_InvalidInput() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setUsername(""); // Invalid username
        request.setPassword("1617895149");
        request.setEmail("ryan@example.com");
        request.setPhoneNumber("12345678");
        request.setUserType("CUSTOMER");

        // Act & Assert
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            userController.register(request);
        });
        
        assertEquals(400, exception.getCode());
    }
} 