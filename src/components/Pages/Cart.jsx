import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';


const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

  
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

   
    const updateCart = (newCart) => {
        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    
    const handleQuantityChange = (id, change) => {
        const newCart = cartItems.map(item => {
            if (item.id === id) {
                const newQuantity = item.quantity + change;
             
                return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
            }
            return item;
        });
        updateCart(newCart);
    };


    const handleRemoveItem = (productId) => {
        const newCart = cartItems.filter(item => item.id !== productId);
        updateCart(newCart);
    };

  
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };


    if (cartItems.length === 0) {
        return (
            <div className="cart-container empty-cart">
                <div className="empty-cart-content">
                    <i className="fas fa-shopping-basket empty-icon"></i>
                    <h2>Giỏ hàng của bạn đang trống</h2>
                    <p>Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
                    <button className="continue-shopping-btn" onClick={() => navigate('/products')}>
                        Tiếp tục mua sắm
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h1 className="cart-title">Giỏ hàng của bạn</h1>
            
            <div className="cart-layout">

                <div className="cart-items-section">
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item-card">
                            <div className="item-image-wrapper">
                                <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} />
                            </div>
                            
                            <div className="item-info">
                                <h3 className="item-name">{item.name}</h3>
                                <div className="item-price-unit">
                                    <span className="item-price">{item.price?.toLocaleString('vi-VN')} đ</span>
                                    {item.unit && <span className="item-unit">/{item.unit}</span>}
                                </div>
                            </div>

                            <div className="item-actions">
                                <div className="quantity-controls">
                                    <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                                    <input type="text" value={item.quantity} readOnly />
                                    <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                                </div>
                                <div className="item-total">
                                    {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                                </div>
                                <button className="remove-btn" onClick={() => handleRemoveItem(item.id)} title="Xóa sản phẩm">
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    )
                    )
                    }
                </div>

                <div className="cart-summary-section">
                    <div className="summary-card">
                        <h3>Tóm tắt đơn hàng</h3>
                        <div className="summary-row">
                            <span>Tạm tính ({cartItems.length} sản phẩm):</span>
                            <span>{calculateTotal().toLocaleString('vi-VN')} đ</span>
                        </div>
                        <div className="summary-row">
                            <span>Phí giao hàng:</span>
                            <span>Miễn phí</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row total-row">
                            <span>Tổng cộng:</span>
                            <span className="total-price">{calculateTotal().toLocaleString('vi-VN')} đ</span>
                        </div>
                        <p className="vat-note">(Đã bao gồm VAT nếu có)</p>
                        
                        <button className="checkout-btn" onClick={() => alert('Chức năng thanh toán đang được phát triển!')}>
                            Tiến hành thanh toán
                        </button>
                        <button className="continue-btn" onClick={() => navigate('/products')}>
                            Mua thêm sản phẩm khác
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );

};

export default Cart;