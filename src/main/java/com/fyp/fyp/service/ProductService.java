package com.fyp.fyp.service;

import java.util.List;

import com.fyp.fyp.dto.ProductRequest;
import com.fyp.fyp.model.Product;
import com.fyp.fyp.model.Enum.ProductCategory;

public interface ProductService {
    /**
     * 根据ID获取商品
     * @param productId 商品ID
     * @return 商品对象
     */
    Product getProductById(Long productId);
    List<Product> getProduct();
    List<Product> getProductByCategory(ProductCategory category);
    Product createProduct(ProductRequest request);
    Product updateProduct(Long id, ProductRequest request);
    void suspendProduct(Long id);
    void deleteProduct(Long id);
} 