import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import logoImage from '../../img/logo.png';
import AdminProduct from './AdminProduct';
import AdminCategory from './AdminCategory';
import AdminCustomer from './AdminCustomer';
import AdminEmployee from './AdminEmployee';
import AdminBill from './AdminBill';
import AdminInvoiceDetails from './AdminInvoiceDetails';

const jsonBase = import.meta.env.BASE_URL || '/';

function fmtNumber(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function fmtCurrency(n) {
  return `${fmtNumber(Number(n) || 0)} đ`;
}

const BILL_STATUS_MAP = {
  delivered: { label: 'Đã giao hàng', cls: 'done' },
  shipping: { label: 'Vận chuyển', cls: 'shipping' },
  pending: { label: 'Chưa giải quyết', cls: 'pending' },
  processing: { label: 'Xử lý', cls: 'processing' },
};

function billStatusFromJson(statusRaw) {
  const key = String(statusRaw || '')
    .trim()
    .toLowerCase();
  if (BILL_STATUS_MAP[key]) return { key, ...BILL_STATUS_MAP[key] };
  return {
    key: 'unknown',
    label: key ? String(statusRaw).trim() : 'Chưa xác định',
    cls: 'unknown',
  };
}

const Admin = () => {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bills, setBills] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [adminSection, setAdminSection] = useState('dashboard');
  const userMenuRef = useRef(null);

  useEffect(() => {
    const raw = localStorage.getItem('currentUser');
    if (!raw) {
      navigate('/login');
      return;
    }
    try {
      const u = JSON.parse(raw);
      if (u.role !== 'staff' && u.role !== 'admin') {
        alert('Bạn không có quyền truy cập vào trang quản trị');
        navigate('/');
        return;
      }

      setAllowed(true);
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!allowed) return;
    const load = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const [pRes, cRes, bRes, cuRes, eRes, iRes] = await Promise.all([
          fetch(`${jsonBase}products.json`).catch(() => ({ ok: false })),
          fetch(`${jsonBase}category.json`).catch(() => ({ ok: false })),
          fetch(`${jsonBase}bill.json`).catch(() => ({ ok: false })),
          fetch(`${jsonBase}customer.json`).catch(() => ({ ok: false })),
          fetch(`${jsonBase}employee.json`).catch(() => ({ ok: false })),
          fetch(`${jsonBase}invoicedetails.json`).catch(() => ({ ok: false })),
        ]);

        if (pRes.ok) setProducts(await pRes.json());
        if (cRes.ok) setCategories(await cRes.json());
        if (bRes.ok) setBills(await bRes.json());
        if (cuRes.ok) setCustomers(await cuRes.json());
        if (eRes.ok) setEmployees(await eRes.json());
        if (iRes.ok) setInvoiceDetails(await iRes.json());
      } catch (e) {
        setLoadError('Lỗi tải dữ liệu. Vui lòng kiểm tra lại các file JSON.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [allowed]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = e => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [userMenuOpen]);

  const staffDisplayName = useMemo(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      if (!raw) return 'Admin';
      const u = JSON.parse(raw);
      return String(u.name || u.user || 'Admin').trim();
    } catch {
      return 'Admin';
    }
  }, []);

  const stats = useMemo(() => {
    const total = products.length || 0;
    const soldSum = invoiceDetails.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );
    const catCount = categories.length || 0;
    const revenue = bills.reduce(
      (sum, bill) => sum + Number(bill.total || 0),
      0
    );
    const avgBill = bills.length ? revenue / bills.length : 0;
    return { total, soldSum, catCount, revenue, avgBill };
  }, [products, categories, invoiceDetails, bills]);

  const logout = () => {
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('userUpdated'));
    navigate('/login');
    setLogoutModalOpen(false);
  };

  const closeMobileNav = () => setMobileSidebarOpen(false);

  if (!allowed) {
    return <div className="ruang-boot" aria-hidden />;
  }

  return (
    <div className="ruang-layout">
      <div
        className={`ruang-overlay ${mobileSidebarOpen ? 'is-visible' : ''}`}
        onClick={closeMobileNav}
      />

      <aside className={`ruang-sidebar ${mobileSidebarOpen ? 'is-open' : ''}`}>
        <div
          className="ruang-sidebar_brand"
          style={{ justifyContent: 'center', padding: '10px 0' }}
        >
          <img
            src={logoImage}
            alt="IzumiPharmacy Logo"
            style={{
              width: '90%',
              maxHeight: '60px',
              objectFit: 'contain',
              filter: 'brightness(0) invert(1)',
              cursor: 'pointer',
              display: 'block',
              margin: '0 auto',
            }}
            title="Về Trang Chủ"
            onClick={() => navigate('/')}
          />
        </div>
        <hr className="ruang-sidebar_divider" />
        <div className="ruang-sidebar_heading">Bảng điều khiển</div>
        <ul className="ruang-sidebar_nav">
          <li>
            <button
              className={`ruang-sidebar_link ${adminSection === 'dashboard' ? 'is-active' : ''}`}
              onClick={() => {
                setAdminSection('dashboard');
                closeMobileNav();
              }}
            >
              <i className="fa-solid fa-chart-pie" /> Tổng quan
            </button>
          </li>
          <li>
            <button
              className={`ruang-sidebar_link ${adminSection === 'products' ? 'is-active' : ''}`}
              onClick={() => {
                setAdminSection('products');
                closeMobileNav();
              }}
            >
              <i className="fa-solid fa-pills" /> Sản phẩm
            </button>
          </li>
          <li>
            <button
              className={`ruang-sidebar_link ${adminSection === 'category' ? 'is-active' : ''}`}
              onClick={() => {
                setAdminSection('category');
                closeMobileNav();
              }}
            >
              <i className="fa-solid fa-tags" /> Danh mục
            </button>
          </li>
          <li>
            <button
              className={`ruang-sidebar_link ${adminSection === 'bill' ? 'is-active' : ''}`}
              onClick={() => {
                setAdminSection('bill');
                closeMobileNav();
              }}
            >
              <i className="fa-solid fa-file-invoice-dollar" /> Hóa đơn
            </button>
          </li>
          <li>
            <button
              className={`ruang-sidebar_link ${adminSection === 'customer' ? 'is-active' : ''}`}
              onClick={() => {
                setAdminSection('customer');
                closeMobileNav();
              }}
            >
              <i className="fa-solid fa-users" /> Khách hàng
            </button>
          </li>
          <li>
            <button
              className={`ruang-sidebar_link ${adminSection === 'employee' ? 'is-active' : ''}`}
              onClick={() => {
                setAdminSection('employee');
                closeMobileNav();
              }}
            >
              <i className="fa-solid fa-id-card" /> Nhân viên
            </button>
          </li>
        </ul>
      </aside>

      <div className="ruang-shell">
        <header className="ruang-topbar">
          <button
            className="ruang-topbar_toggle"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          >
            <i className="fa-solid fa-bars" />
          </button>
          <div className="ruang-topbar_right">
            <div className="ruang-user" ref={userMenuRef}>
              <button
                className="ruang-user_toggle"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <span className="ruang-user_avatar">
                  <i className="fas fa-user-md"></i>
                </span>
                <span className="ruang-user_name">
                  Xin chào, {staffDisplayName}
                </span>
                <i
                  className="fa-solid fa-chevron-down"
                  style={{ fontSize: '0.65rem', opacity: 0.6 }}
                />
              </button>
              {userMenuOpen && (
                <div className="ruang-user_menu">
                  <button onClick={() => navigate('/')}>
                    <i className="fa-solid fa-house" /> Quay về trang chủ
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      setLogoutModalOpen(true);
                    }}
                  >
                    <i className="fa-solid fa-right-from-bracket" /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="ruang-main">
          {adminSection === 'dashboard' ? (
            loading ? (
              <div className="ruang-loading">Đang tải dữ liệu...</div>
            ) : (
              <>
                <div className="ruang-cards">
                  <div className="ruang-stat-card">
                    <div className="ruang-stat-card_body">
                      <div className="ruang-stat-card_label">Doanh thu</div>
                      <div className="ruang-stat-card_value">
                        {fmtCurrency(stats.revenue)}
                      </div>
                      <div className="ruang-stat-card_badge">
                        {bills.length} hóa đơn
                      </div>
                    </div>
                    <div className="ruang-stat-card_icon">
                      <i className="fa-solid fa-wallet" />
                    </div>
                  </div>
                  <div className="ruang-stat-card ruang-stat-card--green">
                    <div className="ruang-stat-card_body">
                      <div className="ruang-stat-card_label">
                        Sản phẩm hiện có
                      </div>
                      <div className="ruang-stat-card_value">
                        {fmtNumber(stats.total)}
                      </div>
                      <div className="ruang-stat-card_badge">Mặt hàng</div>
                    </div>
                    <div className="ruang-stat-card_icon">
                      <i className="fa-solid fa-box-open" />
                    </div>
                  </div>
                  <div className="ruang-stat-card ruang-stat-card--cyan">
                    <div className="ruang-stat-card_body">
                      <div className="ruang-stat-card_label">Khách hàng</div>
                      <div className="ruang-stat-card_value">
                        {fmtNumber(customers.length)}
                      </div>
                      <div className="ruang-stat-card_badge">Đã đăng ký</div>
                    </div>
                    <div className="ruang-stat-card_icon">
                      <i className="fa-solid fa-users" />
                    </div>
                  </div>
                  <div className="ruang-stat-card ruang-stat-card--amber">
                    <div className="ruang-stat-card_body">
                      <div className="ruang-stat-card_label">
                        Sản phẩm đã bán
                      </div>
                      <div className="ruang-stat-card_value">
                        {fmtNumber(stats.soldSum)}
                      </div>
                      <div className="ruang-stat-card_badge">Đơn vị</div>
                    </div>
                    <div className="ruang-stat-card_icon">
                      <i className="fa-solid fa-cart-shopping" />
                    </div>
                  </div>
                </div>

                <div className="ruang-dashboard-grid">
                  <div className="ruang-card">
                    <div className="ruang-card_title-bar">
                      <h6>Hóa đơn gần đây</h6>
                    </div>
                    <div className="admin-table-wrap">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Mã HĐ</th>
                            <th>Ngày</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bills.slice(0, 5).map(row => (
                            <tr key={row.id}>
                              <td>#{row.id}</td>
                              <td>{row.date}</td>
                              <td>{fmtCurrency(row.total)}</td>
                              <td>
                                <span
                                  className={`ruang-status ruang-status--${billStatusFromJson(row.status).cls}`}
                                >
                                  {billStatusFromJson(row.status).label}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {bills.length === 0 && (
                            <tr>
                              <td colSpan="4" style={{ textAlign: 'center' }}>
                                Chưa có dữ liệu hóa đơn
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )
          ) : adminSection === 'products' ? (
            <AdminProduct embedded />
          ) : adminSection === 'category' ? (
            <AdminCategory embedded />
          ) : adminSection === 'customer' ? (
            <AdminCustomer embedded />
          ) : adminSection === 'employee' ? (
            <AdminEmployee embedded />
          ) : adminSection === 'bill' ? (
            <AdminBill embedded />
          ) : adminSection === 'invoiceDetails' ? (
            <AdminInvoiceDetails embedded />
          ) : (
            <div
              className="ruang-card"
              style={{ padding: '20px', textAlign: 'center' }}
            >
              <h2>Chức năng {adminSection} chưa làm nha</h2>
            </div>
          )}
        </main>

        <footer className="ruang-footer">
          Bản quyền thuộc về <a href="/">IzumiPharmacy</a> © 2026.
        </footer>
      </div>

      {logoutModalOpen && (
        <div className="ruang-modal-backdrop">
          <div className="ruang-modal">
            <div className="ruang-modal_header">
              <h5>Xác nhận đăng xuất</h5>
              <button
                className="ruang-modal_close"
                onClick={() => setLogoutModalOpen(false)}
              >
                X
              </button>
            </div>
            <div className="ruang-modal_body">
              Bạn có chắc chắn muốn đăng xuất khỏi hệ thống quản trị?
            </div>
            <div className="ruang-modal_footer">
              <button
                className="ruang-modal_btn"
                onClick={() => setLogoutModalOpen(false)}
              >
                Hủy
              </button>
              <button
                className="ruang-modal_btn ruang-modal_btn--danger"
                onClick={logout}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
