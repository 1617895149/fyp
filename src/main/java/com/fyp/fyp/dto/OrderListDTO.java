package com.fyp.fyp.dto;

import com.fyp.fyp.model.Enum.OrderStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OrderListDTO {
    private Long id;
    private LocalDateTime orderDate;
    private OrderStatus status;
    private Long totalAmount;
    private String notes;
} 