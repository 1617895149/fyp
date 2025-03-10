package com.fyp.fyp.controller;

import com.fyp.fyp.dto.ApiResponse;
import com.fyp.fyp.dto.ProductRequest;
import com.fyp.fyp.exception.BusinessException;
import com.fyp.fyp.model.Product;
import com.fyp.fyp.model.Enum.ProductCategory;
import com.fyp.fyp.service.ProductService;
import com.fyp.fyp.utils.FirebaseStorageUtil;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    private final FirebaseStorageUtil firebaseStorageUtil;

    @GetMapping
    public ApiResponse<List<Product>> getProduct() {
        return ApiResponse.success(productService.getProduct());
    }

    @GetMapping("/{id}")
    public ApiResponse<Product> getProduct(@PathVariable Long id) {
        return ApiResponse.success(productService.getProductById(id));
    }

    @GetMapping("/category/{category}")
    public ApiResponse<List<Product>> getProduct(@PathVariable String category) {
        return ApiResponse.success(productService.getProductByCategory(ProductCategory.valueOf(category)));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<String> createProduct(
            @RequestPart("data") @Valid ProductRequest request,
            @RequestPart("image") List<MultipartFile> images) {
        try {
            List<String> imageUrls = images.stream()
                               .filter(image -> !image.isEmpty()) // 过滤空文件
                               .map(image -> {
                                   try {
                                       String a = firebaseStorageUtil.uploadImage(image, "products/");
                                       System.out.println("Uploading image: " + a);
                                       return a;
                                   } catch (Exception e) {
                                       log.error("Failed to upload image: {}", image.getOriginalFilename(), e);
                                       return null;
                                   }
                               })
                               .filter(Objects::nonNull) // 过滤掉上传失败的null值
                               .collect(Collectors.toList());
                System.out.println("Image URLs: " + imageUrls.get(0));
                System.out.println("Image URLs: " + imageUrls.get(1));
            request.setImageUrl(imageUrls);
            Product product = productService.createProduct(request);
            return ApiResponse.success(HttpStatus.CREATED.value(), product.toString());
        } catch (Exception e) {
            if (request.getImageUrl() != null) {
                try {
                    //firebaseStorageUtil.deleteImage(request.getImageUrl());
                } catch (Exception ignored) {}
            }
            throw e;
        }
    }

    

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Void> updateProductWithImage(
            @PathVariable Long id,
            @RequestPart("data") @Valid ProductRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        
        Product oldProduct = productService.getProductById(id);
        //List<String> oldImageUrls = oldProduct.getImageUrl();
        
        try {
            if (image != null && !image.isEmpty()) {
               // List<String> newImageUrls = firebaseStorageUtil.updateImage(oldImageUrls, image, "products/");
                //request.setImageUrl(newImageUrl);
            }
            
            productService.updateProduct(id, request);
            return ApiResponse.success(null);
        } catch (Exception e) {
            //if (request.getImageUrl() != null && !request.getImageUrl().equals(oldImageUrl)) {
            //    try {
            //        firebaseStorageUtil.deleteImage(request.getImageUrl());
            //    } catch (Exception ignored) {}
            //}
            throw e;
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ApiResponse<Void> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        productService.updateProduct(id, request);
        return ApiResponse.success(null);
    }

    @PatchMapping("/{id}/suspend")
    public ApiResponse<Void> suspendProduct(@PathVariable Long id) {
        productService.suspendProduct(id);
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        // 获取商品信息
        Product product = productService.getProductById(id);
        List<String> imageUrls = product.getImageUrl();
        
        try {
            // 删除商品记录
            productService.deleteProduct(id);
            
            // 删除商品图片
            if (imageUrls != null && !imageUrls.isEmpty()) {
                firebaseStorageUtil.deleteImage(imageUrls);
            }
            
            return ApiResponse.success(null);
        } catch (Exception e) {
            // 如果删除商品成功但删除图片失败，记录错误但不抛出异常
            if (e instanceof BusinessException && ((BusinessException) e).getCode() == 500) {
                log.error("Failed to delete product image: {}", imageUrls, e);
                return ApiResponse.success(null);
            }
            throw e;
        }
    }
} 