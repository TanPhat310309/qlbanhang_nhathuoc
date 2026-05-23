import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const jsonBase = import.meta.env.BASE_URL || '/';

// Khởi tạo form trống chuẩn cho sản phẩm nhà thuốc
const emptyForm = () => ({
  id: '',
  name: '',
  categoryid: '',
  price: '',
  originalPrice: '',
  unit: 'hộp',
  imageKey: 'sp1',
  brand: '',
  description: '',
  ingredients: '',
  usage: '',
  note: ''
});

function productToForm(p) {
  return {
    id: String(p.id),
    name: p.name ?? '',
    categoryid: p.categoryid != null ? String(p.categoryid) : '',
    price: p.price != null ? String(p.price) : '',
    originalPrice: p.originalPrice != null ? String(p.originalPrice) : '',
    unit: p.unit ?? 'hộp',
    imageKey: p.imageKey ?? 'sp1',
    brand: p.brand ?? '',
    description: p.description ?? '',
    ingredients: p.ingredients ?? '',
    usage: p.usage ?? '',
    note: p.note ?? ''
  };
}

function formToProduct(form, nextId) {
  const o = {
    id: form.id ? Number(form.id) : nextId,
    name: form.name.trim(),
    price: Number(form.price) || 0,
    unit: form.unit.trim(),
    imageKey: form.imageKey.trim() || 'sp1',
    brand: form.brand.trim(),
    description: form.description.trim(),
    ingredients: form.ingredients.trim(),
    usage: form.usage.trim(),
    note: form.note.trim()
  };
  
  if (form.categoryid !== '') o.categoryid = Number(form.categoryid);
  if (form.originalPrice !== '') o.originalPrice = Number(form.originalPrice);
  
  return o;
}

function AdminProduct({ embedded = false }) {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(embedded);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState('list');
  const [form, setForm] = useState(emptyForm);
  const [isNew, setIsNew] = useState(false);
  const [searchIdInput, setSearchIdInput] = useState('');
  const [appliedSearchId, setAppliedSearchId] = useState('');

  const displayedProducts = useMemo(() => {
    const q = appliedSearchId.trim();
    if (!q) return products; 
    return products.filter((p) => String(p.id) === q);
  }, [products, appliedSearchId]);

const persistProducts = useCallback(async (nextList) => {
    setSaving(true);
    setSaveError('');
    try {
      localStorage.setItem('productsDB', JSON.stringify(nextList));
      setProducts(nextList);
      await fetch('/api/save/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextList) 
      });
      setView('list');
      setForm(emptyForm());
      setIsNew(false);
    } catch (err) {
      setSaveError('Không lưu được dữ liệu.');
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    if (embedded) {
      setAllowed(true);
      return;
    }
    const raw = localStorage.getItem('currentUser');
    if (!raw) {
      navigate('/login');
      return;
    }
    try {
      const u = JSON.parse(raw);
      if (u.role !== 'staff' && u.role !== 'admin') {
        navigate('/');
        return;
      }
      setAllowed(true);
    } catch {
      navigate('/login');
    }
  }, [navigate, embedded]);

  useEffect(() => {
    if (!allowed) return;
    const load = async () => {
      setLoading(true);
      setLoadError('');
      try {
        let pdata = JSON.parse(localStorage.getItem('productsDB'));
        if (!pdata) {
          const pRes = await fetch(`${jsonBase}products.json?t=${Date.now()}`);
          if (!pRes.ok) throw new Error('Không tải được products.json');
          pdata = await pRes.json();
          localStorage.setItem('productsDB', JSON.stringify(pdata));
        }
        setProducts(Array.isArray(pdata) ? pdata : []);

        let cdata = JSON.parse(localStorage.getItem('categoriesDB'));
        if (!cdata) {
          const cRes = await fetch(`${jsonBase}category.json?t=${Date.now()}`);
          if (cRes.ok) {
             cdata = await cRes.json();
             localStorage.setItem('categoriesDB', JSON.stringify(cdata));
          }
        }
        setCategories(Array.isArray(cdata) ? cdata : []);
      } catch (e) {
        setLoadError(e.message || 'Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [allowed]);

  const goHome = () => navigate('/');
  const logout = () => {
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('userUpdated'));
    navigate('/login');
  };

  const openCreate = () => {
    setIsNew(true);
    setForm(emptyForm());
    setView('form');
    setSaveError('');
  };

  const openEdit = (p) => {
    setIsNew(false);
    setForm(productToForm(p));
    setView('form');
    setSaveError('');
  };

  const cancelForm = () => {
    setView('list');
    setForm(emptyForm());
    setIsNew(false);
    setSaveError('');
  };

  const handleFormChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setSaveError('Vui lòng nhập tên sản phẩm');
      return;
    }
    const nextId = products.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0) + 1;
    const built = formToProduct(form, nextId);
    let nextList;
    if (isNew) {
      nextList = [...products, built];
    } else {
      const idx = products.findIndex((p) => String(p.id) === String(form.id));
      if (idx === -1) {
        setSaveError('Không tìm thấy sản phẩm để cập nhật');
        return;
      }
      nextList = products.map((p) => (String(p.id) === String(form.id) ? built : p));
    }
    persistProducts(nextList);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Xóa sản phẩm này?')) return;
    const nextList = products.filter((p) => String(p.id) !== String(id));
    persistProducts(nextList);
  };

  const applyIdSearch = () => setAppliedSearchId(searchIdInput.trim());
  const clearIdSearch = () => {
    setSearchIdInput('');
    setAppliedSearchId('');
  };

  const bodyContent = (
    <>
      {loadError && <div className="admin-msg admin-msg--error">{loadError}</div>}
      {saveError && <div className="admin-msg admin-msg--error">{saveError}</div>}
      {loading ? (
        <p>Đang tải...</p>
      ) : view === 'list' ? (
        <>
          <div className="admin-toolbar admin-toolbar--row">
            <button type="button" className="admin-btn" onClick={openCreate} disabled={saving}>
              + Thêm sản phẩm
            </button>
            <div className="admin-toolbar-search">
              <label htmlFor="admin-product-search-id">Tìm kiếm: </label>
              <input
                id="admin-product-search-id"
                type="text"
                inputMode="numeric"
                value={searchIdInput}
                onChange={(e) => setSearchIdInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    applyIdSearch();
                  }
                }}
              />
              <button type="button" className="admin-btn" onClick={applyIdSearch} disabled={saving}>
                Tìm
              </button>
              {appliedSearchId.trim() !== '' && (
                <button type="button" className="admin-btn admin-btn--ghost" onClick={clearIdSearch} disabled={saving}>
                  Hiện tất cả
                </button>
              )}
            </div>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên Sản Phẩm</th>
                  <th>Danh mục</th>
                  <th>Thương hiệu</th>
                  <th>Giá bán</th>
                  <th>Đơn vị</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {displayedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="admin-table_empty">
                      {appliedSearchId.trim()
                        ? `Không có sản phẩm với ID "${appliedSearchId.trim()}".`
                        : 'Chưa có sản phẩm.'}
                    </td>
                  </tr>
                ) : (
                  displayedProducts.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.name}
                      </td>
                      <td>
                        {p.categoryid != null
                          ? categories.find((c) => Number(c.id) === Number(p.categoryid))?.name ?? p.categoryid
                          : ''}
                      </td>
                      <td>{p.brand}</td>
                      <td>{p.price?.toLocaleString('vi-VN')} đ</td>
                      <td>{p.unit}</td>
                      <td>
                        <div className="admin-table_actions">
                          <button type="button" className="admin-table_link" onClick={() => openEdit(p)} disabled={saving}>
                            Sửa
                          </button>
                          <button type="button" className="admin-table_link admin-table_link--danger" onClick={() => handleDelete(p.id)} disabled={saving}>
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <form className="admin-form-card" onSubmit={handleSubmitForm} style={{ maxWidth: '900px' }}>
          <h2>{isNew ? 'Thêm sản phẩm' : 'Sửa sản phẩm'}</h2>
          <div className="admin-form-grid">
            {!isNew && (
              <label>
                ID
                <input value={form.id} readOnly />
              </label>
            )}
            
            <label className="admin-form-grid_full">
              Tên thuốc / Sản phẩm
              <input value={form.name} onChange={(e) => handleFormChange('name', e.target.value)} required />
            </label>

            <label>
              Danh mục
              <select value={form.categoryid} onChange={(e) => handleFormChange('categoryid', e.target.value)} required>
                <option value="">- Chọn danh mục -</option>
                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Thương hiệu (Brand)
              <input value={form.brand} onChange={(e) => handleFormChange('brand', e.target.value)} />
            </label>

            <label>
              Giá bán (VNĐ)
              <input type="number" value={form.price} onChange={(e) => handleFormChange('price', e.target.value)} required />
            </label>

            <label>
              Giá gốc (Tùy chọn)
              <input type="number" value={form.originalPrice} onChange={(e) => handleFormChange('originalPrice', e.target.value)} />
            </label>

            <label>
              Đơn vị (Hộp, vỉ, chai...)
              <input value={form.unit} onChange={(e) => handleFormChange('unit', e.target.value)} required />
            </label>

            <label>
              Mã hình ảnh (imageKey)
              <input value={form.imageKey} onChange={(e) => handleFormChange('imageKey', e.target.value)} />
            </label>

            <label className="admin-form-grid_full">
              Mô tả đặc điểm
              <textarea 
                value={form.description} 
                onChange={(e) => handleFormChange('description', e.target.value)} 
                rows="3" 
                style={{ padding: '0.6rem 0.8rem', border: '1px solid #d1d3e2', borderRadius: '4px', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </label>

            <label className="admin-form-grid_full">
              Thành phần
              <textarea 
                value={form.ingredients} 
                onChange={(e) => handleFormChange('ingredients', e.target.value)} 
                rows="2" 
                style={{ padding: '0.6rem 0.8rem', border: '1px solid #d1d3e2', borderRadius: '4px', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </label>

            <label className="admin-form-grid_full">
              Cách dùng
              <textarea 
                value={form.usage} 
                onChange={(e) => handleFormChange('usage', e.target.value)} 
                rows="2" 
                style={{ padding: '0.6rem 0.8rem', border: '1px solid #d1d3e2', borderRadius: '4px', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </label>

            <label className="admin-form-grid_full">
              Lưu ý / Tác dụng phụ
              <textarea 
                value={form.note} 
                onChange={(e) => handleFormChange('note', e.target.value)} 
                rows="2" 
                style={{ padding: '0.6rem 0.8rem', border: '1px solid #d1d3e2', borderRadius: '4px', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </label>
          </div>
          
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={cancelForm} disabled={saving}>
              Hủy
            </button>
          </div>
        </form>
      )}
    </>
  );

  if (embedded) {
    return <div className="admin-product-embed">{bodyContent}</div>;
  }
  if (!allowed) {
    return <div className="admin-page" />;
  }

  return (
    <div className="admin-page">
      <header className="admin-topbar">
        <h1 className="admin-topbar_title">Quản trị sản phẩm</h1>
        <div className="admin-topbar_actions">
          <button type="button" className="admin-topbar_btn" onClick={goHome}>Trang chủ</button>
          <button type="button" className="admin-topbar_btn admin-topbar_btn--primary" onClick={logout}>Đăng xuất</button>
        </div>
      </header>
      <div className="admin-body">{bodyContent}</div>
    </div>
  );
}

export default AdminProduct;