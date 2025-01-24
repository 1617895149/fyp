package com.fyp.fyp.service.impl;

import com.fyp.fyp.dto.ProductRequest;
import com.fyp.fyp.exception.BusinessException;
import com.fyp.fyp.model.Product;
import com.fyp.fyp.model.Enum.ProductCategory;
import com.fyp.fyp.Repository.ProductRepository;
import com.fyp.fyp.service.ProductService;
import com.fyp.fyp.utils.JsonConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final JsonConverter jsonConverter;
    // private final FirebaseStorageUtil util;

    @Override
    public Product getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(404, "商品未找到"));

        // 转换规格和可选规格为Map
        if (product.getSpecification() != null) {
            // Map<String, Object> specMap =
            // jsonConverter.toMap(product.getSpecification());
            // product.setSpecification(jsonConverter.toJson(specMap));
        }

        if (product.getOptionalSpec() != null) {
            Map<String, Object> optionalSpecMap = jsonConverter.toMap(product.getOptionalSpec());
            // System.out.println("kkk"+optionalSpecMap.keySet().toString());
            // System.out.println(optionalSpecMap.get("color").toString());
            product.setOptionalSpec(jsonConverter.toJson(optionalSpecMap));
        }

        System.out.println(product.getOptionalSpec());

        return product;
    }

    @Override
    public List<Product> getProductByCategory(ProductCategory category) {
        List<Product> products = productRepository.findByCategory(category);

        for (Product product : products) {
            // 转换规格和可选规格为Map
            if (product.getSpecification() != null) {
                Map<String, Object> specMap = jsonConverter.toMap(product.getSpecification());
                product.setSpecification(jsonConverter.toJson(specMap));
            }

            if (product.getOptionalSpec() != null) {
                Map<String, Object> optionalSpecMap = jsonConverter.toMap(product.getOptionalSpec());
                product.setOptionalSpec(jsonConverter.toJson(optionalSpecMap));
            }
        }

        return products;
    }

    @Override
    @Transactional
    public Product createProduct(ProductRequest request) {
        System.err.print(request.getImageUrl());
        Product product = new Product();
        product.setCategory(request.getCategory());
        System.out.println("xxx" + request.getCategory());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setImageUrl(request.getImageUrl());
        product.setPrice(request.getPrice());
        // 转换规格和可选规格为JSON字符串
        if (request.getSpecification() != null) {
            product.setSpecification(jsonConverter.toJson(request.getSpecification()));
        }

        if (request.getOptionalSpec() != null) {
            product.setOptionalSpec(jsonConverter.toJson(request.getOptionalSpec()));
        }

        product.setStock(request.getStock());
        product.setBrand(request.getBrand());
        product.setAvailable(true);
        product.setCreatedAt(LocalDateTime.now());

        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProductById(id);

        if (request.getCategory() != null) {
            product.setCategory(request.getCategory());
        }
        if (request.getName() != null) {
            product.setName(request.getName());
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getImageUrl() != null) {
            product.setImageUrl(request.getImageUrl());
        }
        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }
        if (request.getSpecification() != null) {
            product.setSpecification(jsonConverter.toJson(request.getSpecification()));
        }
        if (request.getOptionalSpec() != null) {
            product.setOptionalSpec(jsonConverter.toJson(request.getOptionalSpec()));
        }
        if (request.getStock() != null) {
            product.setStock(request.getStock());
        }
        if (request.getBrand() != null) {
            product.setBrand(request.getBrand());
        }

        return productRepository.save(product);
    }

    @Override
    @Transactional
    public void suspendProduct(Long id) {
        Product product = getProductById(id);
        product.setAvailable(false);
        productRepository.save(product);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new BusinessException(404, "商品未找到");
        }
        productRepository.deleteById(id);
    }

}