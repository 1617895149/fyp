package com.fyp.fyp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "carts_product")
@IdClass(CartProductId.class)
public class CartProduct {
    @Id
    @Column(name = "cart_id")
    private Long cartId;

    @Id
    private Long productId;

    @JsonIgnore
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

    @Id
    private String optionalSpec; // 可选规格
}