import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './ProductCard.css';

const productsUrl = `${import.meta.env.BASE_URL}products.json`;

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleBuy = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(productsUrl);
            if (!response.ok) {
                throw new Error('Không thể tải thông tin sản phẩm');
            }

            const data = await response.json();
            const matchedProduct = data.find((item) => item.id === product.id);
            if (!matchedProduct) {
                throw new Error('Sản phẩm không tồn tại');
            }
            
            navigate(`/product/${product.id}`, {
                state: { product: { ...matchedProduct, image: product.image } }
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="product-card" onClick={handleBuy} style={{ cursor: 'pointer' }}>
            <div className="product-image-container">
                <img 
                    className="product-image"
                    src={product.image || 'https://via.placeholder.com/150'} 
                    alt={product.name} 
                />
            </div>
            
            <div className="product-badge-section">
                <span className="product-badge">Khuyên dùng</span>
            </div>

            <h3 className="product-name">{product.name}</h3>
            
            <div className="product-pricing">
                <span style={{ color: '#d35400', fontWeight: 'bold', fontSize: '18px' }}>
                    {product.price.toLocaleString('vi-VN')} đ
                </span>
            </div>
            
            <div style={{ padding: '0 15px 15px' }}>
                <button 
                    style={{ width: '100%', padding: '10px', backgroundColor: '#0066cc', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleBuy();
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? 'Đang tải...' : 'Xem chi tiết'}
                </button>
            </div>

            {error && (
                <div style={{ color: 'red', fontSize: '12px', padding: '0 15px 10px', textAlign: 'center' }}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default ProductCard;