package com.fyp.fyp.dto;

import lombok.Data;

@Data
public class CreateOrderRequest {
    private String shippingAddress;
    private String contactPhone;
    private String contactEmail;
    private String paymentMethod;
    private String notes;
} 