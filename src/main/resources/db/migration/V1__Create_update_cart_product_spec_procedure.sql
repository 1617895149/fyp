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



CREATE TRIGGER trg_after_insert_customer
ON users
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- 检查插入的行是否满足 UserRole = 'ROLE_CUSTOMER'
    IF EXISTS (SELECT 1 FROM inserted WHERE role = 'ROLE_CUSTOMER')
    BEGIN
        -- 插入表 customers 的数据
        INSERT INTO carts(customer_id)
        SELECT id
        FROM inserted
        WHERE role = 'ROLE_CUSTOMER';
    END
END;