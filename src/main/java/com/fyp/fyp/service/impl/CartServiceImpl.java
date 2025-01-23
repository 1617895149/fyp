package com.fyp.fyp.service.impl;

import com.fyp.fyp.Repository.CartProductRepository;
import com.fyp.fyp.Repository.CartRepository;
import com.fyp.fyp.Repository.ProductRepository;
import com.fyp.fyp.model.Cart;
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

    @Override
    @Transactional
    public void addToCart(Long userId, Long productId, Long price,  int quantity, String optionalSpec) {

        String formattedOptionalSpec = jsonConverter.toJson(optionalSpec);

        // 创建新的 CartProduct 实体
        CartProduct cartProduct = new CartProduct();
        System.out.println("eeeeeee"+cartRepository.findByCustomerId(userId));
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

}