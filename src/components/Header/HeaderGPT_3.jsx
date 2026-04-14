import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderGPT_3.css';
import logoImage from '../../img/logo.png';

const HeaderGPT_3 = () => {
    const [hoveredMenu, setHoveredMenu] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    // Thêm hiệu ứng thu nhỏ Header khi cuộn chuột (rất phổ biến ở các web hiện đại)
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        <header className={`modern-pharma-header ${isScrolled ? 'scrolled' : ''}`}>
            {/* Top bar */}
            <div className="header-top-bar-v3">
                <div className="header-top-content-v3">
                    {/* Delivery Info */}
                    <div className="header-delivery-info-v3">
                        <div className="delivery-badge-v3">
                            <i className="fas fa-truck-fast"></i>
                            <span className="delivery-text-v3">Giao hàng hỏa tốc</span>
                        </div>
                        <div className="phone-wrapper-v3">
                            <i className="fas fa-headset"></i>
                            <span className="delivery-phone-v3">08 1234 4540</span>
                        </div>
                    </div>

                    {/* Logo */}
                    <div className="header-logo-container-v3" onClick={() => navigate('/')}>
                        <div className="logo-glow-effect"></div>
                        <img src={logoImage} alt="Logo Nhà Thuốc" className="header-logo-image-v3" />
                    </div>

                    {/* User Actions */}
                    <div className="header-user-actions-v3">
                        <button className="login-link-v3" onClick={() => navigate('/login')}>
                            <div className="icon-circle">
                                <i className="far fa-user"></i>
                            </div>
                            <span className="user-name-text">
                                {currentUser ? (currentUser.name || currentUser.user) : 'Đăng nhập'}
                            </span>
                        </button>
                        
                        <div className="vertical-divider"></div>
                        
                        <div className="language-selector-v3">
                            <span className="lang-btn active">VN</span>
                            <span className="lang-btn">EN</span>
                        </div>

                        <button className="cart-button-v3" onClick={() => navigate('/cart')}>
                            <div className="cart-icon-wrapper-v3">
                                <i className="fas fa-shopping-bag"></i> {/* Đổi sang icon túi xách hiện đại hơn */}
                                <span className="cart-badge-v3">{cartCount}</span>
                            </div>
                            <span className="cart-text-v3">Giỏ hàng</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="header-navigation-v3">
                <div className="nav-content-v3">
                    <a href="/" className="nav-link-v3">TRANG CHỦ</a>
                    
                    <div 
                        className="nav-item-dropdown-v3"
                        onMouseEnter={() => setHoveredMenu('coffee')}
                        onMouseLeave={() => setHoveredMenu(null)}
                    >
                        <a href="/coffee" className={`nav-link-v3 ${hoveredMenu === 'coffee' ? 'active' : ''}`}>
                            THUỐC
                            <i className="fas fa-chevron-down nav-arrow-v3"></i>
                        </a>
                        
                        <div className={`dropdown-menu-v3 ${hoveredMenu === 'coffee' ? 'show' : ''}`}>
                            {coffeeMenuItems.map((item, index) => (
                                <a key={index} href={item.href || '#'} className="dropdown-item-v3">
                                    <span className="dropdown-text">{item.text}</span>
                                    <i className="fas fa-arrow-right hover-arrow"></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    <a href="/drinks" className="nav-link-v3">THỰC PHẨM CHỨC NĂNG</a>
                    <a href="/products" className="nav-link-v3">DỤNG CỤ Y TẾ</a>
                    <a href="/promotions" className="nav-link-v3">CHĂM SÓC CÁ NHÂN</a>
                    <a href="/about" className="nav-link-v3">MẸ VÀ BÉ</a>
                </div>
            </nav>
        </header>
    );
};

export default HeaderGPT_3;