import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const VOUCHERS = [
  {
    code: 'GIAM20K',
    label: 'Giảm 20.000đ',
    description: 'Đơn hàng từ 120.000đ',
    minOrder: 120000,
    discountAmount: 20000,
    type: 'fixed',
    color: '#10b981',
  },
  {
    code: 'GIAM50K',
    label: 'Giảm 50.000đ',
    description: 'Đơn hàng từ 300.000đ',
    minOrder: 300000,
    discountAmount: 50000,
    type: 'fixed',
    color: '#3b82f6',
  },
  {
    code: 'GIAM100K',
    label: 'Giảm 100.000đ',
    description: 'Đơn hàng từ 500.000đ',
    minOrder: 500000,
    discountAmount: 100000,
    type: 'fixed',
    color: '#8b5cf6',
  },
  {
    code: 'SALE10',
    label: 'Giảm 10%',
    description: 'Đơn hàng từ 200.000đ (tối đa 80.000đ)',
    minOrder: 200000,
    discountPercent: 10,
    maxDiscount: 80000,
    type: 'percent',
    color: '#f59e0b',
  },
  {
    code: 'SALE15',
    label: 'Giảm 15%',
    description: 'Đơn hàng từ 400.000đ (tối đa 150.000đ)',
    minOrder: 400000,
    discountPercent: 15,
    maxDiscount: 150000,
    type: 'percent',
    color: '#ef4444',
  },
  {
    code: 'FREESHIP',
    label: 'Miễn phí vận chuyển',
    description: 'Đơn hàng từ 150.000đ',
    minOrder: 150000,
    discountAmount: 0,
    type: 'freeship',
    color: '#06b6d4',
  },
  {
    code: 'DUOCSI',
    label: 'Ưu đãi khách hàng thân thiết',
    description: 'Giảm 30.000đ - Đơn từ 250.000đ',
    minOrder: 250000,
    discountAmount: 30000,
    type: 'fixed',
    color: '#ec4899',
  },
];

const getDiscount = (voucher, total) => {
  if (!voucher) return 0;
  if (voucher.type === 'fixed') return voucher.discountAmount;
  if (voucher.type === 'freeship') return 0;
  if (voucher.type === 'percent') {
    const disc = Math.round((total * voucher.discountPercent) / 100);
    return Math.min(disc, voucher.maxDiscount);
  }
  return 0;
};

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateCart = newCart => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const increaseQuantity = productId => {
    const updatedCart = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedCart);
  };

  const decreaseQuantity = productId => {
    const updatedCart = cartItems
      .map(item => {
        if (item.id === productId) {
          if (item.quantity > 1) return { ...item, quantity: item.quantity - 1 };
          else return null;
        }
        return item;
      })
      .filter(Boolean);
    updateCart(updatedCart);
  };

  const removeItem = productId => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    updateCart(updatedCart);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const priceString = String(item.price || item.currentPrice || '0');
      const price = parseFloat(priceString.replace(/[^\d]/g, '')) || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const formatPrice = price => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const requireLogin = () => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      alert('Bạn cần đăng nhập để thanh toán.');
      navigate('/login');
      return false;
    }
    return true;
  };

  const total = calculateTotal();
  const discount = getDiscount(selectedVoucher, total);
  const finalTotal = Math.max(0, total - discount);

  const handleSelectVoucher = voucher => {
    if (total < voucher.minOrder) return;
    setSelectedVoucher(voucher);
    setDropdownOpen(false);
    setManualCode('');
    setCodeError('');
  };

  const handleRemoveVoucher = () => {
    setSelectedVoucher(null);
    setManualCode('');
    setCodeError('');
  };

  const handleApplyManualCode = () => {
    const code = manualCode.trim().toUpperCase();
    const found = VOUCHERS.find(v => v.code === code);
    if (!found) {
      setCodeError('Mã voucher không hợp lệ.');
      return;
    }
    if (total < found.minOrder) {
      setCodeError(
        `Đơn hàng tối thiểu ${formatPrice(found.minOrder)} để dùng mã này.`
      );
      return;
    }
    setSelectedVoucher(found);
    setCodeError('');
    setManualCode('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container empty-cart">
        <div className="empty-cart-content">
          <i className="fas fa-shopping-basket empty-icon"></i>
          <h2>Giỏ hàng của bạn đang trống</h2>
          <p>Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
          <button className="continue-shopping-btn" onClick={() => navigate('/')}>
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Giỏ hàng của bạn</h1>

      <div className="cart-layout">
        <div className="cart-items-section">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item-card">
              <div className="item-image-wrapper">
                <img
                  src={item.image || 'https://via.placeholder.com/150'}
                  alt={item.name}
                />
              </div>
              <div className="item-info">
                <h3 className="item-name">{item.name}</h3>
                <div className="item-price-unit">
                  <span className="item-price">
                    {formatPrice(item.price || item.currentPrice)}
                  </span>
                  {item.unit && <span className="item-unit">/{item.unit}</span>}
                </div>
              </div>
              <div className="item-actions">
                <div className="quantity-controls">
                  <button onClick={() => decreaseQuantity(item.id)}>-</button>
                  <input type="text" value={item.quantity} readOnly />
                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                </div>
                <div className="item-total">
                  {formatPrice((item.price || item.currentPrice || 0) * item.quantity)}
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                  title="Xóa sản phẩm"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary-section">
          <div className="summary-card">
            <h3>Tóm tắt đơn hàng</h3>

            <div className="summary-row">
              <span>Tạm tính ({cartItems.length} sản phẩm):</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="summary-row">
              <span>Phí giao hàng:</span>
              <span>
                {selectedVoucher?.type === 'freeship' ? (
                  <span className="freeship-tag">Miễn phí</span>
                ) : (
                  'Miễn phí'
                )}
              </span>
            </div>

            <div className="voucher-section">
              <div className="voucher-section-title">
                <i className="fas fa-ticket-alt"></i>
                <span>Mã giảm giá</span>
              </div>

              {!selectedVoucher && (
                <div className="voucher-dropdown-wrap" ref={dropdownRef}>
                  <button
                    className="voucher-dropdown-trigger"
                    onClick={() => setDropdownOpen(o => !o)}
                  >
                    <span>Chọn voucher</span>
                    <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'}`}></i>
                  </button>

                  {dropdownOpen && (
                    <div className="voucher-dropdown-list">
                      {VOUCHERS.map(v => {
                        const eligible = total >= v.minOrder;
                        const disc = getDiscount(v, total);
                        return (
                          <div
                            key={v.code}
                            className={`voucher-option ${!eligible ? 'voucher-option--disabled' : ''}`}
                            onClick={() => eligible && handleSelectVoucher(v)}
                          >
                            <div
                              className="voucher-option-badge"
                              style={{ background: eligible ? v.color : '#cbd5e1' }}
                            >
                              <i className="fas fa-tag"></i>
                            </div>
                            <div className="voucher-option-info">
                              <div className="voucher-option-label">{v.label}</div>
                              <div className="voucher-option-desc">{v.description}</div>
                              {!eligible && (
                                <div className="voucher-option-need">
                                  Cần thêm {formatPrice(v.minOrder - total)}
                                </div>
                              )}
                            </div>
                            <div className="voucher-option-right">
                              {eligible && disc > 0 && (
                                <span className="voucher-option-save">
                                  -{formatPrice(disc)}
                                </span>
                              )}
                              {eligible && v.type === 'freeship' && (
                                <span className="voucher-option-save">Free ship</span>
                              )}
                              {!eligible && (
                                <i className="fas fa-lock voucher-lock-icon"></i>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {selectedVoucher && (
                <div
                  className="voucher-selected"
                  style={{ borderColor: selectedVoucher.color }}
                >
                  <div
                    className="voucher-selected-badge"
                    style={{ background: selectedVoucher.color }}
                  >
                    <i className="fas fa-check"></i>
                  </div>
                  <div className="voucher-selected-info">
                    <div className="voucher-selected-label">{selectedVoucher.label}</div>
                    <div className="voucher-selected-code">{selectedVoucher.code}</div>
                  </div>
                  <button className="voucher-remove-btn" onClick={handleRemoveVoucher}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}

              {!selectedVoucher && (
                <div className="voucher-manual">
                  <div className="voucher-manual-row">
                    <input
                      type="text"
                      className="voucher-manual-input"
                      placeholder="Nhập mã voucher..."
                      value={manualCode}
                      onChange={e => {
                        setManualCode(e.target.value.toUpperCase());
                        setCodeError('');
                      }}
                      onKeyDown={e => e.key === 'Enter' && handleApplyManualCode()}
                    />
                    <button
                      className="voucher-manual-btn"
                      onClick={handleApplyManualCode}
                      disabled={!manualCode.trim()}
                    >
                      Áp dụng
                    </button>
                  </div>
                  {codeError && (
                    <div className="voucher-error">
                      <i className="fas fa-exclamation-circle"></i> {codeError}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="summary-divider"></div>

            {discount > 0 && (
              <div className="summary-row discount-row">
                <span>Giảm giá voucher:</span>
                <span className="discount-amount">-{formatPrice(discount)}</span>
              </div>
            )}

            <div className="summary-row total-row">
              <span>Tổng cộng:</span>
              <span className="total-price">{formatPrice(finalTotal)}</span>
            </div>
            <p className="vat-note">(Đã bao gồm VAT nếu có)</p>

            <button
              className="checkout-btn"
              onClick={() => {
                if (!requireLogin()) return;
              }}
            >
              Tiến hành thanh toán
            </button>
            <button className="continue-btn" onClick={() => navigate('/')}>
              Mua thêm sản phẩm khác
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
