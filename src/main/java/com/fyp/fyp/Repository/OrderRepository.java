package com.fyp.fyp.Repository;

import com.fyp.fyp.model.Order;
import com.fyp.fyp.model.Enum.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // 查询用户的所有订单
    List<Order> findByCustomerId(Long customerId);
    
    // 查询用户特定状态的订单
    List<Order> findByCustomerIdAndStatus(Long customerId, OrderStatus status);
    
    // 查询最近的订单
    @Query("SELECT o FROM Order o WHERE o.customer.id = :customerId ORDER BY o.orderDate DESC")
    List<Order> findRecentOrdersByCustomerId(@Param("customerId") Long customerId);
} 