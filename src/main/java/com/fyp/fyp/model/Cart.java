package com.fyp.fyp.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Entity
@Data
@Table(name = "carts")
public class Cart {
    @Id
    private Long id; // 使用 User 的 id 作为主键

    @OneToOne
    @MapsId // 将 Cart 的主键映射到 User 的 id
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private User customer;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<CartProduct> cartProducts;
}