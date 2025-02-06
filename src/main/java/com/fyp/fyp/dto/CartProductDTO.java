package com.fyp.fyp.dto;

import lombok.Data;

@Data
public class CartProductDTO {
    private Long cartId;
    private Long productId;
    private String productName;
    private String productImage;
    private double netPrice;
    private int quantity;
    private String optionalSpec;
} 