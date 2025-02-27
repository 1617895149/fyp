package com.fyp.fyp.dto;

import java.util.List;

import lombok.Data;

@Data
public class CartProductDTO {
    private Long cartId;
    private Long productId;
    private String productName;
    private List<String> productImage;
    private double netPrice;
    private int quantity;
    private String optionalSpec;
} 