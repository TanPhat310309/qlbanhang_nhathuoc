import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderGPT_4.css';
import logoImage from '../../img/logo.png';
import { imageMap } from '../../utils/productImages';
import { normalizeSearchText, rankProductsBySearch } from '../../utils/productSearch';

const HeaderGPT_4 = () => {
    const [hoveredMenu, setHoveredMenu] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        window.dispatchEvent(new Event('userUpdated'));
        navigate('/login');
        setUserMenuOpen(false);
    };
    const searchBoxRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const fetchProducts = async () => {
            try {
                const res = await fetch('/products.json');
                if (!res.ok) return;
                const data = await res.json();

                if (!cancelled) {
                    const mappedProducts = data.map(item => ({
                        ...item,
                        image: imageMap[item.imageKey] || item.image
                    }));
                    setProducts(mappedProducts);
                }
            } catch (err) {
                console.error('Lỗi tải sản phẩm cho tìm kiếm:', err);
            }
        };
        fetchProducts();
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        if (!searchFocused) return;
        const onPointerDown = (e) => {
            if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
                setSearchFocused(false);
            }
        };
        document.addEventListener('mousedown', onPointerDown);
        return () => document.removeEventListener('mousedown', onPointerDown);
    }, [searchFocused]);

    const searchMatches = useMemo(() => {
        return rankProductsBySearch(products, searchQuery, 6);
    }, [products, searchQuery]);

    const goToProduct = (product) => {
        setSearchQuery('');
        setSearchFocused(false);
        navigate(`/product/${product.id}`, { state: { product } });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const q = normalizeSearchText(searchQuery);
        if (!q) return;
        setSearchFocused(false);
        alert(`Chức năng chuyển trang kết quả tìm kiếm đang phát triển!`);
    };
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
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
                    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
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
                setCurrentUser(JSON.parse(savedUser));
            } catch (error) {
                setCurrentUser(null);
            }
        };

        updateCartCount();
        updateCurrentUser();

        window.addEventListener('cartUpdated', updateCartCount);
        window.addEventListener('userUpdated', updateCurrentUser);
        return () => {
            window.removeEventListener('cartUpdated', updateCartCount);
            window.removeEventListener('userUpdated', updateCurrentUser);
        };
    }, []);

    const coffeeMenuItems = [
        { text: 'Thuốc kê đơn' },
        { text: 'Thuốc không kê đơn' },
    ];

    return (
        <header className={`modern-pharma-header-v4 ${isScrolled ? 'scrolled' : ''}`}>
            <div className="header-top-bar-v4">
                <div className="header-top-content-v4">
                    <div className="header-delivery-info-v4">
                        <div className="delivery-badge-v4">
                            <i className="fas fa-truck-fast"></i>
                            <span className="delivery-text-v4">Giao hàng hỏa tốc</span>
                        </div>
                        <div className="phone-wrapper-v4">
                            <i className="fas fa-headset"></i>
                            <span className="delivery-phone-v4">08 1234 4540</span>
                        </div>
                    </div>

                    <div className="header-user-actions-v4">
                        <div className="header-user-dropdown-wrapper" ref={userMenuRef} style={{ position: 'relative' }}>
                            <button
                                className="login-link-v4"
                                onClick={() => currentUser ? setUserMenuOpen(!userMenuOpen) : navigate('/login')}
                            >
                                <div className="icon-circle">
                                    <i className="far fa-user"></i>
                                </div>
                                <span className="user-name-text">
                                    {currentUser ? (currentUser.name || currentUser.user) : 'Đăng nhập / Đăng ký'}
                                </span>
                            </button>

                            {currentUser && userMenuOpen && (
                                <div className="dropdown-menu-v4 show" style={{ minWidth: '200px', left: 'auto', right: 0, transform: 'translateY(10px)' }}>
                                    <a href="#profile" className="dropdown-item-v4" onClick={(e) => { e.preventDefault(); navigate('/profile'); setUserMenuOpen(false); }}>
                                        <span className="dropdown-text"><i className="fas fa-address-card" style={{marginRight: '8px', width: '20px'}}></i> Hồ sơ cá nhân</span>
                                    </a>
                                    {(currentUser.role === 'admin' || currentUser.role === 'staff') && (
                                        <a href="#admin" className="dropdown-item-v4" onClick={(e) => { e.preventDefault(); navigate('/admin'); setUserMenuOpen(false); }}>
                                            <span className="dropdown-text"><i className="fas fa-user-shield" style={{marginRight: '8px', width: '20px'}}></i> Trang quản trị</span>
                                        </a>
                                    )}
                                    <div style={{ height: '1px', background: '#e2e8f0', margin: '5px 0' }}></div>
                                    <a href="#logout" className="dropdown-item-v4" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                                        <span className="dropdown-text" style={{color: '#dc2626'}}><i className="fas fa-sign-out-alt" style={{marginRight: '8px', width: '20px'}}></i> Đăng xuất</span>
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="vertical-divider"></div>

                        <div className="language-selector-v4">
                            <span className="lang-btn active">VN</span>
                            <span className="lang-btn">EN</span>
                        </div>

                        <button className="cart-button-v4" onClick={() => navigate('/cart')}>
                            <div className="cart-icon-wrapper-v4">
                                <i className="fas fa-shopping-bag"></i>
                                <span className="cart-badge-v4">{cartCount}</span>
                            </div>
                            <span className="cart-text-v4">Giỏ hàng</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="header-search-container-v4">
                <div className="search-wrapper-v4" ref={searchBoxRef}>
                    <form className={`search-form-v4 ${searchFocused ? 'focused' : ''}`} onSubmit={handleSearchSubmit}>
                        <i className="fas fa-search search-icon-v4"></i>
                        <input
                            type="search"
                            className="search-input-v4"
                            placeholder="Tìm kiếm thuốc, bệnh lý, thực phẩm chức năng..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            autoComplete="off"
                        />
                        <button type="submit" className="search-submit-btn-v4">Tìm kiếm</button>
                    </form>

                    {searchFocused && searchQuery.trim().length > 0 && (
                        <div className="search-dropdown-v4">
                            {searchMatches.length === 0 ? (
                                <div className="search-empty-v4">
                                    <i className="far fa-frown"></i> Không tìm thấy sản phẩm phù hợp.
                                </div>
                            ) : (
                                <ul className="search-list-v4">
                                    {searchMatches.map((p) => (
                                        <li key={p.id}>
                                            <button type="button" className="search-option-btn" onClick={() => goToProduct(p)}>
                                                <img src={p.image || 'https://via.placeholder.com/40'} alt={p.name} className="search-thumb-v4" />
                                                <div className="search-meta-v4">
                                                    <span className="search-name-v4">{p.name}</span>
                                                    <span className="search-price-v4">
                                                        {p.price ? p.price.toLocaleString('vi-VN') : 0}đ
                                                    </span>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="header-navigation-v4">
                <div className="nav-content-v4">
                    <a href="/" className="nav-link-v4">TRANG CHỦ</a>

                    <div
                        className="nav-item-dropdown-v4"
                        onMouseEnter={() => setHoveredMenu('coffee')}
                        onMouseLeave={() => setHoveredMenu(null)}
                    >
                        <a href="/coffee" className={`nav-link-v4 ${hoveredMenu === 'coffee' ? 'active' : ''}`}>
                            THUỐC
                            <i className="fas fa-chevron-down nav-arrow-v4"></i>
                        </a>

                        <div className={`dropdown-menu-v4 ${hoveredMenu === 'coffee' ? 'show' : ''}`}>
                            {coffeeMenuItems.map((item, index) => (
                                <a key={index} href={item.href || '#'} className="dropdown-item-v4">
                                    <span className="dropdown-text">{item.text}</span>
                                    <i className="fas fa-arrow-right hover-arrow"></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    <a href="/drinks" className="nav-link-v4">THỰC PHẨM CHỨC NĂNG</a>
                    <a href="/products" className="nav-link-v4">DỤNG CỤ Y TẾ</a>
                    <a href="/promotions" className="nav-link-v4">CHĂM SÓC CÁ NHÂN</a>
                    <a href="/about" className="nav-link-v4">MẸ VÀ BÉ</a>
                </div>
            </nav>
        </header>
    );
};

export default HeaderGPT_4;