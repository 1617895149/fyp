package com.fyp.fyp.dto;

import java.util.Map;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CartItemRequest {
    @NotBlank(message = "商品ID不能为空")
    private Long productId;

    @NotBlank(message = "数量不能为空")
    @Min(value = 1, message = "数量必须大于0")
    private Integer quantity;

    private Map<String, String> selectedSpecs;
} 