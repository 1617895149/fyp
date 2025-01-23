package com.fyp.fyp.controller;

import com.fyp.fyp.dto.AddToCartRequest;
import com.fyp.fyp.dto.ApiResponse;
import com.fyp.fyp.exception.BusinessException;
import com.fyp.fyp.model.CartProduct;
import com.fyp.fyp.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@AllArgsConstructor
public class CartController {    
    private final CartService cartService;

    @GetMapping
    public ApiResponse<List<CartProduct>> getUserCart(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        return ApiResponse.success(cartService.getUserCart(userId));
    }
    
    @GetMapping("/product/{productId}")
    public ResponseEntity<CartProduct> getCartProduct(
            HttpSession session,
            @PathVariable Long productId) {
        Long userId = (Long) session.getAttribute("userId");
        return ResponseEntity.ok(cartService.getCartProduct(userId, productId));
    }

    @PostMapping("/add")
    public ApiResponse<String> addToCart(@RequestBody AddToCartRequest request,
                                                 HttpSession session){

        Long userId = (Long) session.getAttribute("userId");
        try {
            cartService.addToCart(userId, Long.parseLong(request.getProductId()), request.getPrice(), request.getQuantity(), request.getOptionalSpec());
            return ApiResponse.success("已成功添加");
        } catch (BusinessException e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }
    
    @PutMapping("/product/{productId}/spec")
    public ResponseEntity<Void> updateCartProductSpec(
            HttpSession session,
            @PathVariable Long productId,
            @RequestBody String newSpec) {
        Long userId = (Long) session.getAttribute("userId");
        cartService.updateCartProductSpec(userId, productId, newSpec);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/product/{productId}")
    public ResponseEntity<Void> removeCartProduct(
            HttpSession session,
            @PathVariable Long productId) {
        Long userId = (Long) session.getAttribute("userId");
        cartService.removeCartProduct(userId, productId);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping
    public ResponseEntity<Void> clearUserCart(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        cartService.clearUserCart(userId);
        return ResponseEntity.ok().build();
    }

} 