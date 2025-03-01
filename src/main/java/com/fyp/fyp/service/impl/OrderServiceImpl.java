package com.fyp.fyp.service.impl;

import com.fyp.fyp.Repository.OrderItemRepository;
import com.fyp.fyp.Repository.OrderRepository;
import com.fyp.fyp.Repository.UserRepository;
import com.fyp.fyp.dto.CartProductDTO;
import com.fyp.fyp.dto.CreateOrderRequest;
import com.fyp.fyp.dto.OrderDTO;
import com.fyp.fyp.dto.OrderItemDTO;
import com.fyp.fyp.model.Enum.OrderStatus;
import com.fyp.fyp.model.Order;
import com.fyp.fyp.model.OrderItem;
import com.fyp.fyp.model.Product;
import com.fyp.fyp.model.User;
import com.fyp.fyp.service.CartService;
import com.fyp.fyp.service.OrderService;
import com.fyp.fyp.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final CartService cartService;
    private final ProductService productService;

    @Autowired
    public OrderServiceImpl(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            UserRepository userRepository,
            CartService cartService,
            ProductService productService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
        this.cartService = cartService;
        this.productService = productService;
    }

    @Override
    @Transactional
    public Order createOrder(Long userId, CreateOrderRequest request) {
        // 获取用户信息
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));

        // 获取购物车商品
        List<CartProductDTO> cartItems = cartService.getUserCart(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("购物车为空，无法创建订单");
        }

        // 计算总金额
        Long totalAmount = cartItems.stream()
                .mapToLong(item -> (long)(item.getNetPrice() * item.getQuantity()))
                .sum();

        // 创建订单
        Order order = new Order();
        order.setCustomer(user); 
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING_PAYMENT);
        order.setTotalAmount(totalAmount);
        order.setShippingAddress(request.getShippingAddress());
        order.setContactPhone(request.getContactPhone());
        order.setContactEmail(request.getContactEmail());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setNotes(request.getNotes());

        // 保存订单
        Order savedOrder = orderRepository.save(order);

        // 创建订单项
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartProductDTO cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            
            Product product = productService.getProductById(cartItem.getProductId());
            orderItem.setProduct(product);
            
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice((long)cartItem.getNetPrice());
            orderItem.setSubtotal((long)(cartItem.getNetPrice() * cartItem.getQuantity()));
            orderItem.setProductSpecification(cartItem.getOptionalSpec());
            
            orderItems.add(orderItem);
        }

        // 保存订单项
        orderItemRepository.saveAll(orderItems);

        // 清空购物车
        cartService.clearUserCart(userId);

        return savedOrder;
    }

    @Override
    public List<OrderDTO> getUserOrders(Long userId) {
        List<Order> orders = orderRepository.findByCustomerId(userId);
        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getUserOrdersByStatus(Long userId, OrderStatus status) {
        List<Order> orders = orderRepository.findByCustomerIdAndStatus(userId, status);
        return orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public OrderDTO getOrderDetails(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("订单不存在"));
        return convertToDTO(order);
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("订单不存在"));
        
        order.setStatus(status);
        
        // 根据状态更新相应的时间字段
        switch (status) {
            case PAID:
                order.setPaymentDate(LocalDateTime.now());
                break;
            case SHIPPED:
                order.setShippingDate(LocalDateTime.now());
                break;
            case DELIVERED:
                order.setDeliveryDate(LocalDateTime.now());
                break;
            default:
                break;
        }
        
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("订单不存在"));
        
        // 验证订单所有者
        if (!order.getCustomer().getId().equals(userId)) {
            throw new RuntimeException("无权取消此订单");
        }
        
        // 只有待付款或已付款的订单可以取消
        if (order.getStatus() != OrderStatus.PENDING_PAYMENT && 
            order.getStatus() != OrderStatus.PAID) {
            throw new RuntimeException("订单状态不允许取消");
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    // 辅助方法：将Order实体转换为OrderDTO
    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setCustomerId(order.getCustomer().getId());
        dto.setCustomerName(order.getCustomer().getUsername());
        dto.setOrderDate(order.getOrderDate());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setContactPhone(order.getContactPhone());
        dto.setContactEmail(order.getContactEmail());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentDate(order.getPaymentDate());
        dto.setShippingDate(order.getShippingDate());
        dto.setDeliveryDate(order.getDeliveryDate());
        dto.setNotes(order.getNotes());
        
        // 获取订单项
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        dto.setItems(items.stream()
                .map(this::convertToItemDTO)
                .collect(Collectors.toList()));
        
        return dto;
    }

    // 辅助方法：将OrderItem实体转换为OrderItemDTO
    private OrderItemDTO convertToItemDTO(OrderItem item) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setProductImage(item.getProduct().getImageUrl().get(0)); // 获取第一张图片
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setSubtotal(item.getSubtotal());
        dto.setProductSpecification(item.getProductSpecification());
        return dto;
    }
} 