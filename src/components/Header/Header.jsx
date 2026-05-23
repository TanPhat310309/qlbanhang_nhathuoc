import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import logoImage from '../../img/logo.png';
import { imageMap } from '../../utils/productImages';
import { normalizeSearchText, rankProductsBySearch } from '../../utils/productSearch';

const Header = () => {
    const [hoveredMenu, setHoveredMenu] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const searchBoxRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        window.dispatchEvent(new Event('userUpdated'));
        navigate('/login');
        setUserMenuOpen(false);
    };

    useEffect(() => {
        let cancelled = false;
        const fetchData = async () => {
            try {
                const productsRes = await fetch('/products.json');
                if (!productsRes.ok) return;
                const data = await productsRes.json();
                if (!cancelled) {
                    setProducts(data.map(item => ({
                        ...item,
                        image: imageMap[item.imageKey] || item.image
                    })));
                }
            } catch (err) {
                console.error('Lỗi tải dữ liệu header:', err);
            }
        };
        fetchData();
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
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const updateCartCount = () => {
            const savedCart = localStorage.getItem('cart');
            if (!savedCart) { setCartCount(0); return; }
            try {
                const cart = JSON.parse(savedCart);
                setCartCount(cart.reduce((sum, item) => sum + (item.quantity || 0), 0));
            } catch { setCartCount(0); }
        };
        const updateCurrentUser = () => {
            const savedUser = localStorage.getItem('currentUser');
            if (!savedUser) { setCurrentUser(null); return; }
            try { setCurrentUser(JSON.parse(savedUser)); } catch { setCurrentUser(null); }
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

    // Thuốc dropdown: chỉ 2 mục kê đơn / không kê đơn
    // categoryid 1 = thuốc kê đơn, categoryid 2 = thuốc không kê đơn
    // (điều chỉnh id nếu cần theo category.json thực tế)
    const thuocMenuItems = [
        { text: 'Thuốc kê đơn',      categoryId: 1 },
        { text: 'Thuốc không kê đơn', categoryId: 2 },
    ];

    return (
        <header className={`pharma-header ${isScrolled ? 'scrolled' : ''}`}>

            {/* TOP STRIP */}
            <div className="top-strip">
                <div className="strip-inner">
                    <div className="strip-left">
                        <span className="strip-item">
                            <i className="fas fa-truck-fast"></i> Giao hàng hỏa tốc toàn quốc
                        </span>
                        <span className="strip-divider">|</span>
                        <span className="strip-item">
                            <i className="fas fa-headset"></i> Hotline: <strong>08 1234 4540</strong>
                        </span>
                    </div>
                    <div className="strip-right">
                        <span className="strip-item">
                            <i className="fas fa-shield-halved"></i> Cam kết chính hãng 100%
                        </span>
                    </div>
                </div>
            </div>

            {/* MAIN BAR */}
            <div className="main-bar">
                <div className="main-bar-inner">

                    {/* LOGO */}
                    <div className="logo-zone" onClick={() => navigate('/')}>
                        <img src={logoImage} alt="Logo" className="logo-img" />
                    </div>

                    {/* SEARCH */}
                    <div className="search-zone" ref={searchBoxRef}>
                        <form
                            className={`search-form ${searchFocused ? 'focused' : ''}`}
                            onSubmit={handleSearchSubmit}
                        >
                            <i className="fas fa-search search-icon"></i>
                            <input
                                type="search"
                                className="search-input"
                                placeholder="Tìm kiếm thuốc, bệnh lý, thực phẩm chức năng..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                autoComplete="off"
                            />
                            <button type="submit" className="search-btn">
                                <i className="fas fa-magnifying-glass"></i>
                                <span>Tìm kiếm</span>
                            </button>
                        </form>

                        {searchFocused && searchQuery.trim().length > 0 && (
                            <div className="search-dropdown">
                                {searchMatches.length === 0 ? (
                                    <div className="search-empty">
                                        <i className="far fa-face-frown"></i> Không tìm thấy sản phẩm phù hợp.
                                    </div>
                                ) : (
                                    <ul className="search-list">
                                        {searchMatches.map((p) => (
                                            <li key={p.id}>
                                                <button
                                                    type="button"
                                                    className="search-result-btn"
                                                    onClick={() => goToProduct(p)}
                                                >
                                                    <img
                                                        src={p.image || 'https://via.placeholder.com/40'}
                                                        alt={p.name}
                                                        className="result-thumb"
                                                    />
                                                    <div className="result-meta">
                                                        <span className="result-name">{p.name}</span>
                                                        <span className="result-price">
                                                            {p.price ? p.price.toLocaleString('vi-VN') : 0}đ
                                                        </span>
                                                    </div>
                                                    <i className="fas fa-chevron-right result-arrow"></i>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ACTIONS */}
                    <div className="actions-zone">
                            <button className="action-btn cart-btn" onClick={() => navigate('/cart')}>
                            <div className="action-icon-wrap cart-icon-wrap">
                                <i className="fas fa-bag-shopping"></i>
                                {cartCount > 0 && (
                                    <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
                                )}
                            </div>
                            <div className="action-label">
                                <span className="action-sub">Giỏ hàng</span>
                                <span className="action-main">{cartCount} sản phẩm</span>
                            </div>
                        </button>

                        <div className="user-wrapper" ref={userMenuRef}>
                            <button
                                className="action-btn user-btn"
                                onClick={() => currentUser ? setUserMenuOpen(!userMenuOpen) : navigate('/login')}
                            >
                                <div className="action-icon-wrap">
                                    <i className="far fa-user"></i>
                                </div>
                                <div className="action-label">
                                    <span className="action-sub">Tài khoản</span>
                                    <span className="action-main">
                                        {currentUser ? (currentUser.name || currentUser.user) : 'Đăng nhập'}
                                    </span>
                                </div>
                            </button>

                            {currentUser && userMenuOpen && (
                                <div className="user-dropdown">
                                    <div className="user-dropdown-header">
                                        <i className="fas fa-circle-user"></i>
                                        <span>{currentUser.name || currentUser.user}</span>
                                    </div>
                                    <div className="user-dropdown-body">
                                        <button className="user-dropdown-item"
                                            onClick={() => { navigate('/profile'); setUserMenuOpen(false); }}>
                                            <i className="fas fa-address-card"></i> Hồ sơ cá nhân
                                        </button>
                                        {(currentUser.role === 'admin' || currentUser.role === 'staff') && (
                                            <button className="user-dropdown-item"
                                                onClick={() => { navigate('/admin'); setUserMenuOpen(false); }}>
                                                <i className="fas fa-user-shield"></i> Trang quản trị
                                            </button>
                                        )}
                                        <div className="user-dropdown-sep"></div>
                                        <button className="user-dropdown-item danger"
                                            onClick={handleLogout}>
                                            <i className="fas fa-right-from-bracket"></i> Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* NAVIGATION */}
            <nav className="nav-bar">
                <div className="nav-inner">

                    <button className="nav-link" onClick={() => navigate('/')}>
                        Trang chủ
                    </button>

                    {/* Thuốc — dropdown kê đơn / không kê đơn */}
                    <div
                        className="nav-dropdown-wrap"
                        onMouseEnter={() => setHoveredMenu('thuoc')}
                        onMouseLeave={() => setHoveredMenu(null)}
                    >
                        <button className={`nav-link has-dropdown ${hoveredMenu === 'thuoc' ? 'active' : ''}`}>
                            Thuốc
                            <i className="fas fa-chevron-down nav-chevron"></i>
                        </button>
                        <div className={`nav-dropdown nav-dropdown--categories ${hoveredMenu === 'thuoc' ? 'show' : ''}`}>
                            {thuocMenuItems.map((item) => (
                                <button
                                    key={item.categoryId}
                                    type="button"
                                    className="nav-dropdown-item"
                                    onClick={() => {
                                        setHoveredMenu(null);
                                        navigate(`/products?category=${item.categoryId}`);
                                    }}
                                >
                                    {item.text}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button className="nav-link" onClick={() => navigate('/products?category=3')}>
                        Thực phẩm chức năng
                    </button>

                    <button className="nav-link" onClick={() => navigate('/products?category=5')}>
                        Dụng cụ y tế
                    </button>

                    <button className="nav-link" onClick={() => navigate('/products?category=4')}>
                        Chăm sóc cá nhân
                    </button>

                    <button className="nav-link" onClick={() => navigate('/products?category=8')}>
                        Mẹ và bé
                    </button>

                    <button className="nav-link promo-link" onClick={() => navigate('/products?sale=1')}>
                        Khuyến mãi
                        <span className="promo-badge">HOT</span>
                    </button>

                </div>
            </nav>
        </header>
    );
};

export default Header;
