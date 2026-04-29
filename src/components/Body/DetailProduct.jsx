import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { imageMap } from '../../utils/productImages';
import './DetailProduct.css';

const DetailProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [isLoading, setIsLoading] = useState(!location.state?.product);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch('/products.json');
        if (!response.ok) {
          throw new Error('Không thể tải thông tin sản phẩm');
        }

        const data = await response.json();
        const found = data.find((item) => String(item.id) === String(id));

        if (!found) {
          throw new Error('Sản phẩm không tồn tại');
        }

        setProduct({
          ...found,
          image: imageMap[found.imageKey] || found.image
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, product]);

  
  if (isLoading) {
    return (
      <div className="detail-container" style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
        Đang tải chi tiết sản phẩm...
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-container" style={{ color: 'red', textAlign: 'center', padding: '50px' }}>
        Lỗi: {error}
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <div className="detail-card">
        <div className="detail-image">
          <img
            src={product.image || 'https://via.placeholder.com/500x350'}
            alt={product.name}
          />
        </div>

        <div className="detail-info">
          <div style={{ marginBottom: '15px' }}>
            <span style={{ backgroundColor: '#10b981', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Sản phẩm chính hãng
            </span>
          </div>

          <h2 style={{ fontSize: '28px', color: '#1e293b', marginBottom: '15px', lineHeight: '1.3' }}>
            {product.name}
          </h2>

          <div className="detail-price" style={{ marginBottom: '25px' }}>
            <span className="current-price">
              {product.price?.toLocaleString('vi-VN')} đ{product.unit ? `/${product.unit}` : ''}
            </span>
            
            {product.originalPrice && (
              <>
                <span className="original-price">
                  {product.originalPrice.toLocaleString('vi-VN')} đ
                </span>
                <span className="discount">
                  Giảm {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '20px 0', marginBottom: '25px' }}>
            <p style={{ color: '#475569', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981' }}>✓</span> Cam kết 100% thuốc/thực phẩm chính hãng.
            </p>
            <p style={{ color: '#475569', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981' }}>✓</span> Đổi trả trong vòng 30 ngày nếu có lỗi.
            </p>
            <p style={{ color: '#475569', margin: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981' }}>✓</span> Được tư vấn trực tiếp bởi Dược sĩ chuyên môn.
            </p>
          </div>

          <button
            className="buy-now-button"
            style={{ width: '100%', padding: '16px', fontSize: '18px', borderRadius: '8px' }}
            onClick={() => {
              const savedCart = localStorage.getItem('cart');
              const cart = savedCart ? JSON.parse(savedCart) : [];
              const existingItemIndex = cart.findIndex(item => item.id === product.id);

              if (existingItemIndex >= 0) {
                cart[existingItemIndex].quantity += 1;
              } else {
                cart.push({
                  ...product,
                  quantity: 1
                });
              }

              localStorage.setItem('cart', JSON.stringify(cart));
              window.dispatchEvent(new Event('cartUpdated'));
              navigate('/cart');
            }}
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;