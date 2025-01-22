package com.fyp.fyp.service;

import java.util.List;

import com.fyp.fyp.dto.ProductRequest;
import com.fyp.fyp.model.Product;
import com.fyp.fyp.model.Enum.ProductCategory;

public interface ProductService {
    Product getProductById(Long id);
    List<Product> getProductByCategory(ProductCategory category);
    Product createProduct(ProductRequest request);
    Product updateProduct(Long id, ProductRequest request);
    void suspendProduct(Long id);
    void deleteProduct(Long id);
} 