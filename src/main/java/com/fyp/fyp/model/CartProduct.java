package com.fyp.fyp.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "carts_product")
@IdClass(CartProductId.class)
public class CartProduct {
    @Id
    private Long cartId;

    @Id
    private Long productId;

    @ManyToOne
    @MapsId("cartId") // 映射到复合主键中的 cartId
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne
    @MapsId("productId") // 映射到复合主键中的 productId
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private double netPrice; // 商品净价
    private int quantity; // 商品数量
    private String optionalSpec; // 可选规格
}