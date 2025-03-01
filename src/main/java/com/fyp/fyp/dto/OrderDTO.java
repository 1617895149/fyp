package com.fyp.fyp.dto;

import com.fyp.fyp.model.Enum.OrderStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {
    private Long id;
    private Long customerId;
    private String customerName;
    private LocalDateTime orderDate;
    private OrderStatus status;
    private Long totalAmount;
    private String shippingAddress;
    private String contactPhone;
    private String contactEmail;
    private String paymentMethod;
    private LocalDateTime paymentDate;
    private LocalDateTime shippingDate;
    private LocalDateTime deliveryDate;
    private List<OrderItemDTO> items;
    private String notes;
} 