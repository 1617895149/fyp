package com.fyp.fyp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fyp.fyp.dto.ProductRequest;
import com.fyp.fyp.exception.BusinessException;
import com.fyp.fyp.model.Product;
import com.fyp.fyp.service.ProductService;
import com.fyp.fyp.utils.FirebaseStorageUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @MockBean
    private FirebaseStorageUtil firebaseStorageUtil;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void createProduct_Success() throws Exception {
        // 准备测试数据
        ProductRequest request = new ProductRequest();
        request.setName("Test Product");
        request.setPrice(99.99);

        Product product = new Product();
        product.setId(1L);

        MockMultipartFile image = new MockMultipartFile(
            "image", "test.jpg", "image/jpeg", "test image content".getBytes()
        );

        MockMultipartFile jsonFile = new MockMultipartFile(
            "data", "", "application/json", objectMapper.writeValueAsBytes(request)
        );

        // Mock 外部服务响应
        when(firebaseStorageUtil.uploadImage(any(), eq("products/")))
            .thenReturn("https://test-image-url.com");
        when(productService.createProduct(any())).thenReturn(product);

        // 执行测试
        mockMvc.perform(multipart("/api/products")
                .file(image)
                .file(jsonFile))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.code").value(201))
            .andExpect(jsonPath("$.data").value(1));
    }

    @Test
    void updateProduct_Success() throws Exception {
        // 准备测试数据
        ProductRequest request = new ProductRequest();
        request.setName("Updated Product");
        request.setPrice(199.99);

        Product oldProduct = new Product();
        oldProduct.setImageUrl("https://old-image-url.com");

        MockMultipartFile image = new MockMultipartFile(
            "image", "test.jpg", "image/jpeg", "test image content".getBytes()
        );

        MockMultipartFile jsonFile = new MockMultipartFile(
            "data", "", "application/json", objectMapper.writeValueAsBytes(request)
        );

        // Mock 外部服务响应
        when(productService.getProductById(1L)).thenReturn(oldProduct);
        when(firebaseStorageUtil.updateImage(anyString(), any(), eq("products/")))
            .thenReturn("https://new-image-url.com");

        // 执行测试
        mockMvc.perform(multipart("/api/products/{id}", 1L)
                .file(image)
                .file(jsonFile)
                .with(reques -> {
                    reques.setMethod("PUT");
                    return reques;
                }))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code").value(200));
    }

    @Test
    void deleteProduct_Success() throws Exception {
        // 准备测试数据
        Product product = new Product();
        product.setImageUrl("https://test-image-url.com");

        // Mock 外部服务响应
        when(productService.getProductById(1L)).thenReturn(product);
        doNothing().when(firebaseStorageUtil).deleteImage(anyString());

        // 执行测试
        mockMvc.perform(delete("/api/products/{id}", 1L))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code").value(200));

        // 验证调用
        verify(productService).deleteProduct(1L);
        verify(firebaseStorageUtil).deleteImage(product.getImageUrl());
    }

    @Test
    void deleteProduct_ImageDeleteFailed_StillSuccess() throws Exception {
        // 准备测试数据
        Product product = new Product();
        product.setImageUrl("https://test-image-url.com");

        // Mock 外部服务响应
        when(productService.getProductById(1L)).thenReturn(product);
        doThrow(new BusinessException(500, "Image delete failed"))
            .when(firebaseStorageUtil).deleteImage(anyString());

        // 执行测试
        mockMvc.perform(delete("/api/products/{id}", 1L))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code").value(200));
    }
} 