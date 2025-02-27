package com.fyp.fyp.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

import com.fyp.fyp.model.Enum.ProductCategory;

@Entity
@Data
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductCategory category;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    
    @Column(nullable = false)
    private List<String> imageUrl;

    @Column(nullable = false)
    private double price;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String specification;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String optionalSpec;

    @Column(nullable = false)
    private int stock;

    @Column(nullable = false)
    private boolean isAvailable = true;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
