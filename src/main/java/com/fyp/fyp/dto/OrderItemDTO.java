package com.fyp.fyp.dto;

import lombok.Data;

@Data
public class OrderItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private Integer quantity;
    private Long unitPrice;
    private Long subtotal;
    private String productSpecification;
} 