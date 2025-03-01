package com.fyp.fyp.service.impl;

import com.fyp.fyp.Repository.CartProductRepository;
import com.fyp.fyp.Repository.CartRepository;
import com.fyp.fyp.Repository.ProductRepository;
import com.fyp.fyp.model.CartProduct;
import com.fyp.fyp.service.CartService;
import com.fyp.fyp.utils.JsonConverter;
import com.fyp.fyp.dto.CartProductDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    private final CartProductRepository cartProductRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final JsonConverter jsonConverter;

    @Autowired
    public CartServiceImpl(CartProductRepository cartProductRepository, CartRepository cartRepository,  JsonConverter jsonConverter, ProductRepository productRepository) {
        this.cartProductRepository = cartProductRepository;
        this.jsonConverter = jsonConverter;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    @Override
    public List<CartProductDTO> getUserCart(Long userId) {
        List<CartProduct> cartProducts = cartProductRepository.findByCartId(userId);
        return cartProducts.stream().map(cp -> {
            CartProductDTO dto = new CartProductDTO();
            dto.setCartId(cp.getCartId());
            dto.setProductId(cp.getProductId());
            dto.setProductName(cp.getProduct().getName());
            dto.setProductImage(cp.getProduct().getImageUrl());
            dto.setNetPrice(cp.getNetPrice());
            dto.setQuantity(cp.getQuantity());
            dto.setOptionalSpec(cp.getOptionalSpec());
            return dto;
        }).collect(Collectors.toList());
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

    @Override
    @Transactional
    public void addToCart(Long userId, Long productId, Long price,  int quantity, String optionalSpec) {

        String formattedOptionalSpec = jsonConverter.toJson(optionalSpec);

        ;

        if(cartProductRepository
        .findByUserIdAndProductIdAndOptionalSpec(userId, productId, formattedOptionalSpec).isPresent()){
            System.out.println("nomore");
        }

        
        // 创建新的 CartProduct 实体
        CartProduct cartProduct = new CartProduct();
        cartProduct.setProduct(productRepository.findById(productId).get());
        cartProduct.setCart(cartRepository.findByCustomerId(userId));
        cartProduct.setCartId(userId);
        cartProduct.setProductId(productId);
        cartProduct.setQuantity(quantity);
        cartProduct.setNetPrice(price); // 需要从 Product 表中获取实际价格
        cartProduct.setOptionalSpec(formattedOptionalSpec);

        // 保存到数据库
        cartProductRepository.save(cartProduct);
    }

    @Override
    @Transactional
    public void updateCartProductQuantity(Long userId, Long productId, int quantity) {
        if (quantity < 1) {
            throw new IllegalArgumentException("数量必须大于0");
        }
        
        CartProduct cartProduct = cartProductRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new RuntimeException("购物车中不存在该商品"));
        
        cartProduct.setQuantity(quantity);
        cartProductRepository.save(cartProduct);
    }

}