package com.fyp.fyp.Repository;

import com.fyp.fyp.model.CartProduct;
import com.fyp.fyp.model.CartProductId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartProductRepository extends JpaRepository<CartProduct, CartProductId> {
    
    @Query(value = "SELECT * FROM carts_product WHERE cart_id = :cartId", nativeQuery = true)
    List<CartProduct> findByCartId(@Param("cartId") Long userId);
    
    @Query("SELECT cp FROM CartProduct cp WHERE cp.cart.customer.id = :userId AND cp.product.id = :productId")
    Optional<CartProduct> findByUserIdAndProductId(@Param("userId") Long userId, @Param("productId") Long productId);
    
    @Procedure(name = "UPDATE_CART_PRODUCT_SPEC")
    void updateCartProductSpec(@Param("userId") Long userId, 
                             @Param("productId") Long productId, 
                             @Param("newSpec") String newSpec);

    @Query("SELECT cp FROM CartProduct cp WHERE cp.cartId = :userId AND cp.productId = :productId AND cp.optionalSpec = :optionalSpec")
    Optional<CartProduct> findByUserIdAndProductIdAndOptionalSpec(Long userId, Long productId, String optionalSpec);
    
    @Modifying
    @Query("DELETE FROM CartProduct cp WHERE cp.cart.customer.id = :userId AND cp.product.id = :productId")
    void deleteByUserIdAndProductId(@Param("userId") Long userId, @Param("productId") Long productId);
    
    @Modifying
    @Query("DELETE FROM CartProduct cp WHERE cp.cart.customer.id = :userId")
    void deleteAllByUserId(@Param("userId") Long userId);
} 