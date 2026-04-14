import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderGPT_2.css';
import logoImage from '../../img/logo.png';

const HeaderGPT_2 = () => {
    const [hoveredMenu, setHoveredMenu] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const updateCartCount = () => {
            const savedCart = localStorage.getItem('cart');
            if (!savedCart) {
                setCartCount(0);
            } else {
                try {
                    const cart = JSON.parse(savedCart);
                    const totalItems = cart.reduce(
                        (sum, item) => sum + (item.quantity || 0),
                        0
                    );
                    setCartCount(totalItems);
                } catch (error) {
                    console.error('Lỗi đọc giỏ hàng:', error);
                    setCartCount(0);
                }
            }
        };

        const updateCurrentUser = () => {
            const savedUser = localStorage.getItem('currentUser');
            if (!savedUser) {
                setCurrentUser(null);
                return;
            }

            try {
                const user = JSON.parse(savedUser);
                setCurrentUser(user);
            } catch (error) {
                console.error('Lỗi đọc thông tin người dùng:', error);
                setCurrentUser(null);
            }
        };

        updateCartCount();
        updateCurrentUser();

        window.addEventListener('cartUpdated', updateCartCount);
        window.addEventListener('userUpdated', updateCurrentUser);
        window.addEventListener('storage', () => {
            updateCartCount();
            updateCurrentUser();
        });

        return () => {
            window.removeEventListener('cartUpdated', updateCartCount);
            window.removeEventListener('userUpdated', updateCurrentUser);
            window.removeEventListener('storage', () => {
                updateCartCount();
                updateCurrentUser();
            });
        };
    }, []);

    const coffeeMenuItems = [
        { text: 'Thuốc kê đơn' },
        { text: 'Thuốc không kê đơn' },
    ];

    return (
        <header className="phuclong-header">
            {/* Top bar */}
            <div className="header-top-bar">
                <div className="header-top-content">
                    {/* Delivery Info */}
                    <div className="header-delivery-info">
                        <span className="delivery-text">Giao hàng tận nơi</span>
                        <div className="phone-wrapper">
                            <i className="fas fa-phone delivery-icon"></i>
                            <span className="delivery-phone">08 1234 4540</span>
                        </div>
                        <div className="delivery-scooter">
                            <i className="fas fa-motorcycle"></i>
                        </div>
                    </div>

                    {/* Logo */}
                    <div className="header-logo-container">
                        <div className="phuclong-logo">
                            <img src={logoImage} alt="Logo Nhà Thuốc" className="header-logo-image" />
                        </div>
                    </div>

                    {/* User Actions */}
                    <div className="header-user-actions">
                        <button
                            className="login-link"
                            onClick={() => navigate('/login')}
                        >
                            <i className="far fa-user"></i>
                            <span>{currentUser ? (currentUser.name || currentUser.user) : 'Đăng nhập'}</span>
                        </button>
                        
                        <span className="action-separator">|</span>
                        
                        <div className="language-selector">
                            <span className="lang-active">VN</span>
                            <span className="lang-separator">-</span>
                            <span className="lang-option">EN</span>
                        </div>

                        <button
                            className="cart-button"
                            onClick={() => navigate('/cart')}
                        >
                            <div className="cart-icon-wrapper">
                                <i className="fas fa-shopping-cart"></i>
                                <span className="cart-badge">{cartCount}</span>
                            </div>
                            <span className="cart-text">Giỏ hàng</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="header-navigation">
                <div className="nav-content">
                    <a href="/" className="nav-link">TRANG CHỦ</a>
                    
                    <div 
                        className="nav-item-with-dropdown"
                        onMouseEnter={() => setHoveredMenu('coffee')}
                        onMouseLeave={() => setHoveredMenu(null)}
                    >
                        <a href="/coffee" className={`nav-link ${hoveredMenu === 'coffee' ? 'active' : ''}`}>
                            THUỐC
                            <i className="fas fa-chevron-down nav-arrow"></i>
                        </a>
                        {hoveredMenu === 'coffee' && (
                            <div className="dropdown-menu">
                                {coffeeMenuItems.map((item, index) => (
                                    <a 
                                        key={index}
                                        href={item.href || '#'}
                                        className="dropdown-item"
                                    >
                                        {item.text}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    <a href="/drinks" className="nav-link">THỰC PHẨM CHỨC NĂNG</a>
                    <a href="/products" className="nav-link">DỤNG CỤ Y TẾ</a>
                    <a href="/promotions" className="nav-link">CHĂM SÓC CÁ NHÂN</a>
                    <a href="/about" className="nav-link">MẸ VÀ BÉ</a>
                </div>
            </nav>
        </header>
    );
};

export default HeaderGPT_2;