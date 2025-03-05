package com.fyp.fyp.Repository;

import com.fyp.fyp.model.Order;
import com.fyp.fyp.model.Enum.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // 分页查询所有订单
    Page<Order> findAll(Pageable pageable);
    
    // 分页查询用户的订单
    Page<Order> findByCustomerId(Long customerId, Pageable pageable);
    
    // 分页查询特定状态的订单
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
    
    // 分页查询用户特定状态的订单
    Page<Order> findByCustomerIdAndStatus(Long customerId, OrderStatus status, Pageable pageable);
    
    // 按日期范围查询订单
    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate")
    Page<Order> findByOrderDateBetween(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );
    
    // 按日期范围和用户查询订单
    @Query("SELECT o FROM Order o WHERE o.customer.id = :customerId AND o.orderDate BETWEEN :startDate AND :endDate")
    Page<Order> findByCustomerIdAndOrderDateBetween(
        @Param("customerId") Long customerId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );
} 