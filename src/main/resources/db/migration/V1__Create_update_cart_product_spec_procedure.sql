CREATE PROCEDURE UPDATE_CART_PRODUCT_SPEC
    @userId BIGINT,
    @productId BIGINT,
    @newSpec NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (
        SELECT 1 
        FROM carts_product cp
        INNER JOIN carts c ON cp.cart_id = c.customer_id
        WHERE c.customer_id = @userId AND cp.product_id = @productId
    )
    BEGIN
        UPDATE carts_product
        SET optional_spec = @newSpec
        FROM carts_product cp
        INNER JOIN carts c ON cp.cart_id = c.customer_id
        WHERE c.customer_id = @userId AND cp.product_id = @productId
    END
    ELSE
    BEGIN
        INSERT INTO carts_product (cart_id, product_id, optional_spec, quantity, net_price)
        SELECT c.customer_id, @productId, @newSpec, 1, p.price
        FROM carts c
        CROSS JOIN products p
        WHERE c.customer_id = @userId AND p.id = @productId
    END
END 