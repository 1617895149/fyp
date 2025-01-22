package com.fyp.fyp.service.impl;

import com.fyp.fyp.Repository.CartProductRepository;
import com.fyp.fyp.model.CartProduct;
import com.fyp.fyp.service.CartService;
import com.fyp.fyp.utils.JsonConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {
    
    private final CartProductRepository cartProductRepository;
    private final JsonConverter jsonConverter;
    
    @Autowired
    public CartServiceImpl(CartProductRepository cartProductRepository, JsonConverter jsonConverter) {
        this.cartProductRepository = cartProductRepository;
        this.jsonConverter = jsonConverter;
    }
    
    @Override
    public List<CartProduct> getUserCart(Long userId) {
        return cartProductRepository.findByUserId(userId);
    }
    
    @Override
    public CartProduct getCartProduct(Long userId, Long productId) {
        return cartProductRepository.findByUserIdAndProductId(userId, productId)
                .orElse(null);
    }
    
    @Override
    @Transactional
    public void updateCartProductSpec(Long userId, Long productId, String newSpec) {
        // 验证JSON格式
        jsonConverter.toMap(newSpec);
        cartProductRepository.updateCartProductSpec(userId, productId, newSpec);
    }
    
    @Override
    @Transactional
    public void removeCartProduct(Long userId, Long productId) {
        cartProductRepository.deleteByUserIdAndProductId(userId, productId);
    }
    
    @Override
    @Transactional
    public void clearUserCart(Long userId) {
        cartProductRepository.deleteAllByUserId(userId);
    }
} 