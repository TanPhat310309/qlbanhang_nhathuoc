import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderGPT_5.css';
import logoImage from '../../img/logo.png';

const HeaderGPT_5 = () => {
    const [hoveredMenu, setHoveredMenu] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
                    setCartCount(cart.reduce((sum, item) => sum + (item.quantity || 0), 0));
                } catch (error) { setCartCount(0); }
            }
        };

        const updateCurrentUser = () => {
            const savedUser = localStorage.getItem('currentUser');
            if (!savedUser) {
                setCurrentUser(null);
                return;
            }
            try { setCurrentUser(JSON.parse(savedUser)); } 
            catch (error) { setCurrentUser(null); }
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
            window.removeEventListener('storage', updateCartCount);
        };
    }, []);

    const coffeeMenuItems = [
        { text: 'Thuốc kê đơn' },
        { text: 'Thuốc không kê đơn' },
    ];

    return (
        <header className={`modern-pharma-header-v5 ${isScrolled ? 'scrolled' : ''}`}>
            <div className="header-top-bar-v5">
                <div className="header-top-content-v5">
                    <div className="header-delivery-info-v5">
                        <div className="delivery-badge-v5">
                            <i className="fas fa-leaf"></i> {/* Đổi icon cho hợp đa dạng theme */}
                            <span className="delivery-text-v5">Cam kết chính hãng</span>
                        </div>
                        <div className="phone-wrapper-v5">
                            <i className="fas fa-headset"></i>
                            <span className="delivery-phone-v5">08 1234 4540</span>
                        </div>
                    </div>

                    <div className="header-logo-container-v5" onClick={() => navigate('/')}>
                        <div className="logo-glow-effect"></div>
                        <img src={logoImage} alt="Logo Nhà Thuốc" className="header-logo-image-v5" />
                    </div>

                    <div className="header-user-actions-v5">
                        <button className="login-link-v5" onClick={() => navigate('/login')}>
                            <div className="icon-circle">
                                <i className="far fa-user"></i>
                            </div>
                            <span className="user-name-text">
                                {currentUser ? (currentUser.name || currentUser.user) : 'Đăng nhập / Đăng ký'}
                            </span>
                        </button>
                        
                        <div className="vertical-divider"></div>
                        
                        <div className="language-selector-v5">
                            <span className="lang-btn active">VN</span>
                            <span className="lang-btn">EN</span>
                        </div>

                        <button className="cart-button-v5" onClick={() => navigate('/cart')}>
                            <div className="cart-icon-wrapper-v5">
                                <i className="fas fa-shopping-bag"></i>
                                <span className="cart-badge-v5">{cartCount}</span>
                            </div>
                            <span className="cart-text-v5">Giỏ hàng</span>
                        </button>
                    </div>
                </div>
            </div>

            <nav className="header-navigation-v5">
                <div className="nav-content-v5">
                    <a href="/" className="nav-link-v5">TRANG CHỦ</a>
                    
                    <div 
                        className="nav-item-dropdown-v5"
                        onMouseEnter={() => setHoveredMenu('thuoc')}
                        onMouseLeave={() => setHoveredMenu(null)}
                    >
                        <a href="/coffee" className={`nav-link-v5 ${hoveredMenu === 'thuoc' ? 'active' : ''}`}>
                            THUỐC
                            <i className="fas fa-chevron-down nav-arrow-v5"></i>
                        </a>
                        
                        <div className={`dropdown-menu-v5 ${hoveredMenu === 'thuoc' ? 'show' : ''}`}>
                            {coffeeMenuItems.map((item, index) => (
                                <a key={index} href={item.href || '#'} className="dropdown-item-v5">
                                    <span className="dropdown-text">{item.text}</span>
                                    <i className="fas fa-arrow-right hover-arrow"></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    <a href="/drinks" className="nav-link-v5">THỰC PHẨM CHỨC NĂNG</a>
                    <a href="/products" className="nav-link-v5">DỤNG CỤ Y TẾ</a>
                    <a href="/promotions" className="nav-link-v5">CHĂM SÓC CÁ NHÂN</a>
                    <a href="/about" className="nav-link-v5">MẸ VÀ BÉ</a>
                </div>
            </nav>
        </header>
    );
};

export default HeaderGPT_5;