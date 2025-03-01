package com.fyp.fyp.service;

import com.fyp.fyp.dto.CreateOrderRequest;
import com.fyp.fyp.dto.OrderDTO;
import com.fyp.fyp.model.Enum.OrderStatus;
import com.fyp.fyp.model.Order;

import java.util.List;

public interface OrderService {
    
    /**
     * 创建新订单
     * @param userId 用户ID
     * @param request 创建订单请求
     * @return 创建的订单
     */
    Order createOrder(Long userId, CreateOrderRequest request);
    
    /**
     * 获取用户的所有订单
     * @param userId 用户ID
     * @return 订单列表
     */
    List<OrderDTO> getUserOrders(Long userId);
    
    /**
     * 获取用户特定状态的订单
     * @param userId 用户ID
     * @param status 订单状态
     * @return 订单列表
     */
    List<OrderDTO> getUserOrdersByStatus(Long userId, OrderStatus status);
    
    /**
     * 获取订单详情
     * @param orderId 订单ID
     * @return 订单详情
     */
    OrderDTO getOrderDetails(Long orderId);
    
    /**
     * 更新订单状态
     * @param orderId 订单ID
     * @param status 新状态
     * @return 更新后的订单
     */
    Order updateOrderStatus(Long orderId, OrderStatus status);
    
    /**
     * 取消订单
     * @param orderId 订单ID
     * @param userId 用户ID (用于验证权限)
     * @return 取消后的订单
     */
    Order cancelOrder(Long orderId, Long userId);
} 