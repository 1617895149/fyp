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
    @MapsId("cartId") // 映射复合主键中的 cartId
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart; // 关联的购物车

    @ManyToOne
    @MapsId("productId") // 映射复合主键中的 productId
    @JoinColumn(name = "product_id", nullable = false)
    private Product product; // 关联的商品

    private double netPrice; // 商品净价

    @Column(columnDefinition = "INT")
    private int quantity; // 商品数量

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String optionalSpec; // 可选规格
} 