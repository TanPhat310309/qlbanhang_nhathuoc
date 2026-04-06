import React from 'react';
import './Footer.css';
import logo from '../../img/logoblue.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <footer className="highlands-footer">
      <div className="footer-green-strip"></div>

      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-logo">
            <img src={logo} alt="Izumi Pharmacy" className="footer-logo-img" />
          </div>
          <p className="footer-copyright">
            ©2026 IzumiPharmacy. All rights reserved
          </p>
        </div>

        <div className="footer-middle">
          <div className="footer-column">
            <h3 className="footer-column-title">VỀ IZUMI PHARMACY</h3>
            <ul className="footer-links">
              <li><a href="/about">Giới thiệu</a></li>
              <li><a href="/services">Dịch vụ chăm sóc sức khỏe</a></li>
              <li><a href="/careers">Tuyển dụng</a></li>
              <li><a href="/contact">Liên hệ</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-column-title">SẢN PHẨM & HỆ THỐNG</h3>
            <ul className="footer-links">
              <li><a href="/products">Thuốc & Thực phẩm chức năng</a></li>
              <li><a href="/equipment">Dụng cụ y tế</a></li>
              <li><a href="/find-store">Tìm nhà thuốc gần nhất</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-column-title">TIN TỨC & KIẾN THỨC</h3>
            <ul className="footer-links">
              <li><a href="/news">Tin tức y tế</a></li>
              <li><a href="/health-tips">Kiến thức chăm sóc sức khỏe</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-right">
          <h3 className="footer-column-title">THEO DÕI CHÚNG TÔI</h3>
          <div className="footer-social-icons">
            <a href="https://facebook.com" className="social-icon" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" className="social-icon" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://youtube.com" className="social-icon" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://tiktok.com" className="social-icon" aria-label="TikTok">
              <i className="fab fa-tiktok"></i>
            </a>
          </div>

          <div className="footer-map">
            <iframe
              title="Địa điểm Izumi Pharmacy"
              className="footer-map_iframe"
              src="https://maps.google.com/maps?q=10.743902,106.6340446&z=17&output=embed&hl=vi"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a
              className="footer-map_link"
              href="https://maps.app.goo.gl/6RuUrqKaYAFspPe57"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mở trong Google Maps
            </a>
          </div>
        </div>
      </div>

      <div className="footer-chat-icon" title="Chat với chúng tôi">
        <i className="fas fa-comment-dots"></i>
      </div>
    </footer>
  );
};

export default Footer;
