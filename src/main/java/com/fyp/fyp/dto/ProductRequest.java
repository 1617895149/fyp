package com.fyp.fyp.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import com.fyp.fyp.model.Enum.ProductCategory;
import java.util.Map;

@Data
public class ProductRequest {
    @NotNull(message = "商品类别不能为空")
    private ProductCategory category;
    
    @NotBlank(message = "商品名称不能为空")
    private String name;
    
    @NotBlank(message = "商品描述不能为空")
    private String description;
    
    @Nullable
    private String imageUrl;
    
    @NotNull(message = "商品价格不能为空")
    @Positive(message = "商品价格必须大于0")
    private Double price;
    
    private Map<String, Object> specification;
    
    private Map<String, Object> optionalSpec;
    
    @NotNull(message = "商品库存不能为空")
    @Positive(message = "商品库存必须大于0")
    private Integer stock;
    
    @NotBlank(message = "商品品牌不能为空")
    private String brand;
} 