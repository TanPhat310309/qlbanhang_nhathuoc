import React from 'react';
import './Footer.css';
import logo from '../../img/logoblue.png';
import bct from '../../img/bct.png';
import dmca from '../../img/dmca.png';
import legitScript from '../../img/legitscript.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <footer className="highlands-footer">

      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-logo">
            <img src={logo} alt="Izumi Pharmacy" className="footer-logo-img" />
          </div>
          <p className="footer-copyright">
            ©2026 IzumiPharmacy. All rights reserved.
          </p>
          
          <div className="footer-certifications">
            <img src={bct} alt="Bộ Công Thương" className="cert-img" />
            <img src={dmca} alt="DMCA Protected" className="cert-img dmca-img" />
            <img src={legitScript} alt="LegitScript" className="cert-img legit-img" />
          </div>
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
            <h3 className="footer-column-title">HỖ TRỢ KHÁCH HÀNG</h3>
            <ul className="footer-links">
              <li><a href="/faq">Câu hỏi thường gặp</a></li>
              <li><a href="/policy">Chính sách đổi trả</a></li>
              <li><a href="/shipping">Chính sách giao hàng</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-right">
          <h3 className="footer-column-title">THEO DÕI CHÚNG TÔI</h3>
          <div className="footer-social-icons">
            <a href="https://facebook.com" className="social-icon" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="https://instagram.com" className="social-icon" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="https://youtube.com" className="social-icon" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
            <a href="https://tiktok.com" className="social-icon" aria-label="TikTok"><i className="fab fa-tiktok"></i></a>
          </div>

          <div className="footer-payment-methods">
            <h3 className="footer-column-title payment-title">HỖ TRỢ THANH TOÁN</h3>
            <div className="payment-icons">
              <i className="fab fa-cc-visa"></i>
              <i className="fab fa-cc-mastercard"></i>
              <i className="fab fa-cc-paypal"></i>
              <i className="fab fa-cc-apple-pay"></i>
            </div>
          </div>
        </div>
      </div>

  
      <div className="footer-disclaimer">
        <p>LƯU Ý: Sản phẩm này không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh. Vui lòng đọc kỹ hướng dẫn sử dụng trước khi dùng, hoặc tham khảo ý kiến của Bác sĩ / Dược sĩ.</p>
      </div>

    </footer>
  );
};

export default Footer;