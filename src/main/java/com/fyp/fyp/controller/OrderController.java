package com.fyp.fyp.controller;

import com.fyp.fyp.dto.*;
import com.fyp.fyp.model.Enum.OrderStatus;
import com.fyp.fyp.model.Order;
import com.fyp.fyp.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * 创建新订单
     */
    @PostMapping
    public ApiResponse<OrderDetailDTO> createOrder(
            @RequestBody CreateOrderRequest request,
            HttpSession session) {
        try {
            Long userId = (Long) session.getAttribute("userId");
            Order order = orderService.createOrder(userId, request);
            OrderDetailDTO orderDTO = orderService.getOrderDetails(order.getId());
            return ApiResponse.success(orderDTO);
        } catch (Exception e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }

    /**
     * 获取订单列表（分页）
     */
    @GetMapping
    public ApiResponse<Page<OrderListDTO>> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpSession session) {
        try {
            Long userId = (Long) session.getAttribute("userId");
            Page<OrderListDTO> orders = orderService.getUserOrders(userId, PageRequest.of(page, size));
            return ApiResponse.success(orders);
        } catch (Exception e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }

    /**
     * 按状态获取订单列表（分页）
     */
    @GetMapping("/status/{status}")
    public ApiResponse<Page<OrderListDTO>> getOrdersByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpSession session) {
        try {
            Long userId = (Long) session.getAttribute("userId");
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
            Page<OrderListDTO> orders = orderService.getUserOrdersByStatus(
                userId, orderStatus, PageRequest.of(page, size));
            return ApiResponse.success(orders);
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(400, "无效的订单状态");
        } catch (Exception e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }

    /**
     * 按日期范围获取订单列表（分页）
     */
    @GetMapping("/date")
    public ApiResponse<Page<OrderListDTO>> getOrdersByDate(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpSession session) {
        try {
            Long userId = (Long) session.getAttribute("userId");
            LocalDateTime start = LocalDateTime.parse(startDate);
            LocalDateTime end = LocalDateTime.parse(endDate);
            Page<OrderListDTO> orders = orderService.getUserOrdersByDateRange(
                userId, start, end, PageRequest.of(page, size));
            return ApiResponse.success(orders);
        } catch (Exception e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }

    /**
     * 获取订单详情
     */
    @GetMapping("/{orderId}")
    public ApiResponse<OrderDetailDTO> getOrderDetails(@PathVariable Long orderId) {
        try {
            OrderDetailDTO order = orderService.getOrderDetails(orderId);
            return ApiResponse.success(order);
        } catch (Exception e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }

    /**
     * 取消订单
     */
    @PostMapping("/{orderId}/cancel")
    public ApiResponse<OrderDetailDTO> cancelOrder(
            @PathVariable Long orderId,
            HttpSession session) {
        try {
            Long userId = (Long) session.getAttribute("userId");
            Order order = orderService.cancelOrder(orderId, userId);
            OrderDetailDTO orderDTO = orderService.getOrderDetails(order.getId());
            return ApiResponse.success(orderDTO);
        } catch (Exception e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }

    /**
     * 支付订单（模拟）
     */
    @PostMapping("/{orderId}/pay")
    public ApiResponse<OrderDetailDTO> payOrder(
            @PathVariable Long orderId,
            HttpSession session) {
        try {
            // 这里只是简单模拟支付过程
            Order order = orderService.updateOrderStatus(orderId, OrderStatus.PAID);
            OrderDetailDTO orderDTO = orderService.getOrderDetails(order.getId());
            return ApiResponse.success(orderDTO);
        } catch (Exception e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }
} 