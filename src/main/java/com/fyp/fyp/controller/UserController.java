package com.fyp.fyp.controller;

import com.fyp.fyp.dto.ApiResponse;
import com.fyp.fyp.dto.LoginRequest;
import com.fyp.fyp.dto.RegisterRequest;
import com.fyp.fyp.model.User;
import com.fyp.fyp.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Long> register(@Valid @RequestBody RegisterRequest request) {
        User user = userService.register(request);
        return ApiResponse.success(user.getId());
    }

    @PostMapping("/login")
    public ApiResponse<Long> login(@Valid @RequestBody LoginRequest request, HttpSession session,
            HttpServletResponse response) {
        User user = userService.login(request);
        session.setAttribute("userId", user.getId());
        session.setAttribute("username", user.getUsername());
        session.setAttribute("userRole", user.getRole());
        session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
        System.out.println(session.getAttribute("userId") + "eeeeee");
        Cookie cookie = new Cookie("JSESSIONID", session.getId());
        cookie.setMaxAge(60 * 60 * 24); // 有效期为一天
        cookie.setAttribute("userId", user.getId().toString());
        cookie.setPath("/");
        // response.addCookie(cookie);
        return ApiResponse.success(user.getId());
    }

    @PostMapping("/logout")
    public ApiResponse<String> logout(HttpSession session) {
        session.invalidate();
        SecurityContextHolder.clearContext();
        return ApiResponse.success("logout sucess");
    }
}
