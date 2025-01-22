package com.fyp.fyp.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class CartProductId implements Serializable {
    private Long cartId; // 购物车 ID
    private Long productId; // 商品 ID

    @Override
    public int hashCode() {
        return Objects.hash(cartId, productId);
    }
} 