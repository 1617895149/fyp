package com.fyp.fyp.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddToCartRequest {
    @NotNull(message = "productId is required")
    private String productId;

    @Min(value = 1, message = "quantity must be at least 1")
    private Integer quantity = 1;

    @NotNull(message = "price is required")
    private Long price;
    @Nullable
    private String optionalSpec;
}
