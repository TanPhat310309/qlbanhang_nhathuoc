import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Bổ sung thêm hook này để chuyển trang
import './ProductList.css';
import amlodipineImg from '../../img/lsp1/amlodipine5mg.png';
import amoxicillinImg from '../../img/lsp1/amoxicillin500mg.png';
import augmentinImg from '../../img/lsp1/augmentin1g.png';
// ... import đủ 10 file ảnh của bạn vào đây

const imageMap = {
  'amlodipine': amlodipineImg,
  'amoxicillin': amoxicillinImg,
  'augmentin': augmentinImg,
  // ... map đủ 10 key tương ứng với file JSON
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Khởi tạo hàm chuyển trang
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/products.json');
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu sản phẩm');
        }

        const data = await response.json();
        const mappedProducts = data.map((item) => ({
          ...item,
          image: imageMap[item.imageKey] || item.image
        }));

        setProducts(mappedProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="product-list-container">
        Đang tải sản phẩm...
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list-container">
        Lỗi: {error}
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="product-list">
        {products.map((product) => (
          /* Đã thay thế <ProductCard /> bằng thẻ div bọc trực tiếp nội dung */
          <div 
            key={product.id} 
            className="product-card" 
            onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
            style={{ cursor: 'pointer', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '16px', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
          >
            <img 
              src={product.image || 'https://via.placeholder.com/200'} 
              alt={product.name} 
              style={{ width: '100%', height: '200px', objectFit: 'contain', marginBottom: '12px' }}
            />
            <div className="product-info" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '18px', margin: '0 0 8px', color: '#0f172a' }}>{product.name}</h3>
              <p className="price" style={{ color: '#d35400', fontWeight: 'bold', fontSize: '16px', margin: '0 0 12px' }}>
                {product.price.toLocaleString('vi-VN')} đ
              </p>
              <button 
                style={{ width: '100%', padding: '10px', background: '#0066cc', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;