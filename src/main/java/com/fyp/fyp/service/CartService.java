package com.fyp.fyp.service;

import java.util.List;

import com.fyp.fyp.model.CartProduct;

public interface CartService {
    List<CartProduct> getUserCart(Long userId);
    CartProduct getCartProduct(Long userId, Long productId);
    void updateCartProductSpec(Long userId, Long productId, String newSpec);
    void removeCartProduct(Long userId, Long productId);
    void clearUserCart(Long userId);
} 