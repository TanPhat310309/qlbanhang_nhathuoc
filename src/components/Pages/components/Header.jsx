import React from 'react';
import { 
  FaSearch, FaMicrophone, FaBell, FaShoppingCart, 
  FaUserCircle, FaChevronDown 
} from 'react-icons/fa';
import './Header.css';

const Header = ({ onSwitchTo }) => {
  return (
    <header className="main-header">
      {/* KHỐI TRÊN: Logo, Tìm kiếm, Giỏ hàng, Tài khoản */}
      <div className="header-top">
        {/* Logo */}
        <div className="header-logo" onClick={() => onSwitchTo('home')}>
          {}
          <img src="/logo-izumi.png" alt="Izumi Pharmacy Logo" className="logo-img" />
          <div className="logo-text">
            <span className="izumi-text">IZUMI</span>
            <span className="pharmacy-text">PHARMACY</span>
          </div>
        </div>

        {}
        <div className="header-promo">
          <div className="promo-text-top">KHUYẾN MÃI</div>
          <div className="promo-text-bottom">CHO MỌI ĐƠN HÀNG TỪ 0Đ</div>
        </div>

        {}
        <div className="header-search">
          <FaSearch className="search-icon-left" />
          <input type="text" placeholder="Tìm tên thuốc..." className="search-input" />
          <FaMicrophone className="search-icon-right" />
        </div>

        {}
        <div className="header-actions">
          <div className="action-item">
            <FaBell className="action-icon" />
          </div>
          <div className="action-item">
            <FaShoppingCart className="action-icon" />
          </div>
          {}
          <div className="action-item user-action" onClick={() => onSwitchTo('login')}>
            <FaUserCircle className="action-icon user-icon" />
            <span className="user-text">Đăng nhập/Đăng ký</span>
          </div>
        </div>
      </div>

      {}
      <div className="header-bottom">
        <ul className="nav-menu">
          <li className="nav-item">Thuốc <FaChevronDown className="nav-arrow" /></li>
          <li className="nav-item">Thực phẩm chức năng <FaChevronDown className="nav-arrow" /></li>
          <li className="nav-item">Dược mỹ phẩm <FaChevronDown className="nav-arrow" /></li>
          <li className="nav-item">Thiết bị y tế <FaChevronDown className="nav-arrow" /></li>
          <li className="nav-item">Chăm sóc cá nhân <FaChevronDown className="nav-arrow" /></li>
          <li className="nav-item">Mẹ và bé <FaChevronDown className="nav-arrow" /></li>
          <li className="nav-item">Đông y <FaChevronDown className="nav-arrow" /></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;