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
  
  // State mới cho số lượng và Tab hiển thị
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (product) return;
    const fetchProduct = async () => {
      try {
        const response = await fetch('/products.json');
        if (!response.ok) throw new Error('Không thể tải thông tin sản phẩm');

        const data = await response.json();
        const found = data.find((item) => String(item.id) === String(id));

        if (!found) throw new Error('Sản phẩm không tồn tại');

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

  const handleAddToCart = (redirect = false) => {
    const savedCart = localStorage.getItem('cart');
    const cart = savedCart ? JSON.parse(savedCart) : [];
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    const currentTime = Date.now();

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity;
      cart[existingItemIndex].addedAt = currentTime;
    } else {
      cart.push({ ...product, quantity, addedAt: currentTime });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));

    if (redirect) {
      navigate('/cart');
    } else {
      alert(`Đã thêm ${quantity} ${product.unit || 'sản phẩm'} vào giỏ hàng!`);
    }
  };

  if (isLoading) return <div className="detail-loading">Đang tải chi tiết sản phẩm...</div>;
  if (error) return <div className="detail-error">Lỗi: {error}</div>;
  if (!product) return null;

  return (
    <div className="detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i> Quay lại
      </button>

      {/* THÔNG TIN CHÍNH */}
      <div className="detail-card">
        <div className="detail-image">
          <img src={product.image || 'https://via.placeholder.com/500x350'} alt={product.name} />
        </div>

        <div className="detail-info">
          <div className="detail-badges">
            <span className="badge-genuine">
              <i className="fas fa-shield-alt"></i> 100% Chính hãng
            </span>
            <span className="badge-brand">Thương hiệu: {product.brand || 'Đang cập nhật'}</span>
          </div>

          <h2>{product.name}</h2>
          <p className="product-sku">Mã sản phẩm: SP{String(product.id).padStart(5, '0')}</p>

          <div className="detail-price">
            <span className="current-price">
              {product.price?.toLocaleString('vi-VN')} ₫
              <span className="unit-text">/{product.unit || 'Hộp'}</span>
            </span>
            {product.originalPrice && (
              <>
                <span className="original-price">{product.originalPrice.toLocaleString('vi-VN')} ₫</span>
                <span className="discount">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          <div className="detail-commitments">
            <p><i className="fas fa-check-circle"></i> Cam kết 100% thuốc/thực phẩm chính hãng.</p>
            <p><i className="fas fa-sync-alt"></i> Đổi trả trong vòng 30 ngày nếu có lỗi.</p>
            <p><i className="fas fa-user-md"></i> Được tư vấn trực tiếp bởi Dược sĩ chuyên môn.</p>
          </div>

          <div className="detail-actions-group">
            <div className="quantity-selector">
              <span className="qty-label">Số lượng:</span>
              <div className="qty-controls">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}><i className="fas fa-minus"></i></button>
                <input type="number" value={quantity} readOnly />
                <button onClick={() => setQuantity(q => q + 1)}><i className="fas fa-plus"></i></button>
              </div>
            </div>

            <div className="buttons-group">
              <button className="add-cart-btn" onClick={() => handleAddToCart(false)}>
                <i className="fas fa-cart-plus"></i> Thêm vào giỏ
              </button>
              <button className="buy-now-btn" onClick={() => handleAddToCart(true)}>
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-tabs-section">
        <div className="tabs-header">
          <button className={activeTab === 'description' ? 'active' : ''} onClick={() => setActiveTab('description')}>Mô tả sản phẩm</button>
          <button className={activeTab === 'ingredients' ? 'active' : ''} onClick={() => setActiveTab('ingredients')}>Thành phần</button>
          <button className={activeTab === 'usage' ? 'active' : ''} onClick={() => setActiveTab('usage')}>Cách dùng</button>
          <button className={activeTab === 'note' ? 'active' : ''} onClick={() => setActiveTab('note')}>Lưu ý</button>
        </div>
        <div className="tabs-content">
          {activeTab === 'description' && (
            <div className="tab-pane">
              <h3>Đặc điểm nổi bật</h3>
              <p>{product.description || "Thông tin mô tả chi tiết của sản phẩm này đang được cập nhật..."}</p>
            </div>
          )}
          {activeTab === 'ingredients' && (
            <div className="tab-pane">
              <h3>Thành phần chi tiết</h3>
              <p>{product.ingredients || "Thông tin thành phần của sản phẩm này đang được cập nhật..."}</p>
            </div>
          )}
          {activeTab === 'usage' && (
            <div className="tab-pane">
              <h3>Hướng dẫn sử dụng & Liều lượng</h3>
              <p>{product.usage || "Sử dụng theo đúng chỉ định của bác sĩ hoặc hướng dẫn in trên bao bì sản phẩm."}</p>
            </div>
          )}
          {activeTab === 'note' && (
            <div className="tab-pane">
              <h3>Chống chỉ định & Tác dụng phụ</h3>
              <p>{product.note || "Bảo quản nơi khô ráo, thoáng mát. Tránh xa tầm tay trẻ em. Đọc kỹ hướng dẫn sử dụng trước khi dùng."}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;