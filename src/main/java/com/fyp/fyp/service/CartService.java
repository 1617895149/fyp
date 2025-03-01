package com.fyp.fyp.service;

import java.util.List;

import com.fyp.fyp.model.CartProduct;
import com.fyp.fyp.dto.CartProductDTO;

public interface CartService {
    List<CartProductDTO> getUserCart(Long userId);
    CartProduct getCartProduct(Long userId, Long productId);
    void updateCartProductSpec(Long userId, Long productId, String newSpec);
    void removeCartProduct(Long userId, Long productId);
    void clearUserCart(Long userId);
    void addToCart(Long userId, Long productId, Long price, int quantity, String optionalSpec);
    void updateCartProductQuantity(Long userId, Long productId, int quantity);
} 