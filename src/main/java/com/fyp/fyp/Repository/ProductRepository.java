package com.fyp.fyp.Repository;

import com.fyp.fyp.model.Product;
import com.fyp.fyp.model.Enum.ProductCategory;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(ProductCategory category);
}   