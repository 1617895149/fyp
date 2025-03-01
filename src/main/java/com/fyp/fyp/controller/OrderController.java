package com.fyp.fyp.controller;

import com.fyp.fyp.dto.ApiResponse;
import com.fyp.fyp.dto.CreateOrderRequest;
import com.fyp.fyp.dto.OrderDTO;
import com.fyp.fyp.model.Enum.OrderStatus;
import com.fyp.fyp.model.Order;
import com.fyp.fyp.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.List;

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
    public ApiResponse<OrderDTO> createOrder(
            @RequestBody CreateOrderRequest request,
            HttpSession session) {
        try {
            Long userId = (Long) session.getAttribute("userId");
            Order order = orderService.createOrder(userId, request);
            OrderDTO orderDTO = orderService.getOrderDetails(order.getId());
            return ApiResponse.success(orderDTO);
        } catch (Exception e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }

    /**
     * 获取用户的所有订单
     */
    @GetMapping
    public ApiResponse<List<OrderDTO>> getUserOrders(HttpSession session) {
        try {
            Long userId = (Long) session.getAttribute("userId");
            List<OrderDTO> orders = orderService.getUserOrders(userId);
            return ApiResponse.success(orders);
        } catch (Exception e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }

    /**
     * 获取用户特定状态的订单
     */
    @GetMapping("/status/{status}")
    public ApiResponse<List<OrderDTO>> getUserOrdersByStatus(
            @PathVariable String status,
            HttpSession session) {
        try {
            Long userId = (Long) session.getAttribute("userId");
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
            List<OrderDTO> orders = orderService.getUserOrdersByStatus(userId, orderStatus);
            return ApiResponse.success(orders);
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(400, "无效的订单状态");
        } catch (Exception e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }

    /**
     * 获取订单详情
     */
    @GetMapping("/{orderId}")
    public ApiResponse<OrderDTO> getOrderDetails(@PathVariable Long orderId) {
        try {
            OrderDTO order = orderService.getOrderDetails(orderId);
            return ApiResponse.success(order);
        } catch (Exception e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }

    /**
     * 取消订单
     */
    @PostMapping("/{orderId}/cancel")
    public ApiResponse<OrderDTO> cancelOrder(
            @PathVariable Long orderId,
            HttpSession session) {
        try {
            Long userId = (Long) session.getAttribute("userId");
            Order order = orderService.cancelOrder(orderId, userId);
            OrderDTO orderDTO = orderService.getOrderDetails(order.getId());
            return ApiResponse.success(orderDTO);
        } catch (Exception e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }

    /**
     * 支付订单（模拟）
     */
    @PostMapping("/{orderId}/pay")
    public ApiResponse<OrderDTO> payOrder(
            @PathVariable Long orderId,
            HttpSession session) {
        try {
            // 这里只是简单模拟支付过程
            Order order = orderService.updateOrderStatus(orderId, OrderStatus.PAID);
            OrderDTO orderDTO = orderService.getOrderDetails(order.getId());
            return ApiResponse.success(orderDTO);
        } catch (Exception e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }
} 