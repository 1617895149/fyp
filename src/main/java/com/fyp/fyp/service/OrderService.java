package com.fyp.fyp.service;

import com.fyp.fyp.dto.CreateOrderRequest;
import com.fyp.fyp.dto.OrderDetailDTO;
import com.fyp.fyp.dto.OrderListDTO;
import com.fyp.fyp.model.Enum.OrderStatus;
import com.fyp.fyp.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;

public interface OrderService {
    
    /**
     * 创建新订单
     * @param userId 用户ID
     * @param request 创建订单请求
     * @return 创建的订单
     */
    Order createOrder(Long userId, CreateOrderRequest request);
    
    /**
     * 获取用户的订单列表（分页）
     * @param userId 用户ID
     * @param pageable 分页参数
     * @return 订单列表
     */
    Page<OrderListDTO> getUserOrders(Long userId, Pageable pageable);
    
    /**
     * 获取用户特定状态的订单（分页）
     * @param userId 用户ID
     * @param status 订单状态
     * @param pageable 分页参数
     * @return 订单列表
     */
    Page<OrderListDTO> getUserOrdersByStatus(Long userId, OrderStatus status, Pageable pageable);
    
    /**
     * 获取用户特定日期范围的订单（分页）
     * @param userId 用户ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param pageable 分页参数
     * @return 订单列表
     */
    Page<OrderListDTO> getUserOrdersByDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    /**
     * 获取订单详情
     * @param orderId 订单ID
     * @return 订单详情
     */
    OrderDetailDTO getOrderDetails(Long orderId);
    
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