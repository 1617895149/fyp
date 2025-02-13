package com.fyp.fyp.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fyp.fyp.model.Cart;



@Repository
public interface CartRepository extends JpaRepository<Cart, Long>{
    
    Cart findByCustomerId(Long customerId);
}
