package com.fyp.fyp.service;

import com.fyp.fyp.dto.ProductRequest;
import com.fyp.fyp.exception.BusinessException;
import com.fyp.fyp.model.Product;
import com.fyp.fyp.model.Enum.ProductCategory;
import com.fyp.fyp.Repository.ProductRepository;
import com.fyp.fyp.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private ProductRequest productRequest;
    private Product product;

    @BeforeEach
    void setUp() {
        // 初始化测试数据
        productRequest = new ProductRequest();
        productRequest.setCategory(ProductCategory.CPU);
        productRequest.setName("Intel Core i9");
        productRequest.setDescription("High performance CPU");
        productRequest.setImageUrl("http://example.com/image.jpg");
        productRequest.setPrice(499.99);
        productRequest.setStock(100);
        productRequest.setBrand("Intel");

        product = new Product();
        product.setId(1L);
        product.setCategory(ProductCategory.CPU);
        product.setName("Intel Core i9");
        product.setDescription("High performance CPU");
        product.setImageUrl("http://example.com/image.jpg");
        product.setPrice(499.99);
        product.setStock(100);
        product.setBrand("Intel");
        product.setAvailable(true);
    }

    @Test
    void getProductById_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        Product result = productService.getProductById(1L);

        assertNotNull(result);
        assertEquals(product.getId(), result.getId());
        assertEquals(product.getName(), result.getName());
    }

    @Test
    void getProductById_NotFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        BusinessException exception = assertThrows(BusinessException.class,
            () -> productService.getProductById(1L));

        assertEquals(404, exception.getCode());
        assertEquals("商品未找到", exception.getMessage());
    }

    @Test
    void createProduct_Success() {
        when(productRepository.save(any(Product.class))).thenReturn(product);

        Product result = productService.createProduct(productRequest);

        assertNotNull(result);
        assertEquals(product.getName(), result.getName());
        assertEquals(product.getPrice(), result.getPrice());
        assertTrue(result.isAvailable());
    }

    @Test
    void updateProduct_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        productRequest.setPrice(599.99);
        Product result = productService.updateProduct(1L, productRequest);

        assertNotNull(result);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void suspendProduct_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        productService.suspendProduct(1L);

        verify(productRepository).save(any(Product.class));
    }

    @Test
    void deleteProduct_Success() {
        when(productRepository.existsById(1L)).thenReturn(true);
        doNothing().when(productRepository).deleteById(1L);

        productService.deleteProduct(1L);

        verify(productRepository).deleteById(1L);
    }

    @Test
    void deleteProduct_NotFound() {
        when(productRepository.existsById(1L)).thenReturn(false);

        BusinessException exception = assertThrows(BusinessException.class,
            () -> productService.deleteProduct(1L));

        assertEquals(404, exception.getCode());
        assertEquals("商品未找到", exception.getMessage());
    }
} 