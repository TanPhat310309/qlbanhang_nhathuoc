import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import { imageMap } from '../../utils/productImages';
import './ProductList.css';

const PRODUCTS_PER_PAGE = 10;

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryParam = searchParams.get('category');
  const selectedCategoryId = categoryParam != null ? Number(categoryParam) : null;
  const saleParam = searchParams.get('sale');
  const allParam = searchParams.get('all');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/products.json'),
          fetch('/category.json')
        ]);

        if (!productsRes.ok) throw new Error('Không thể tải dữ liệu sản phẩm');

        const data = await productsRes.json();
        setProducts(data.map((item) => ({
          ...item,
          image: imageMap[item.imageKey] || item.image
        })));

        if (categoriesRes.ok) {
          const catData = await categoriesRes.json();
          setCategories(Array.isArray(catData) ? catData : []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryId, saleParam, allParam]);

  const filteredProducts = useMemo(() => {
    if (selectedCategoryId != null) return products.filter((p) => p.categoryid === selectedCategoryId);
    if (saleParam != null) return products.filter((p) => p.originalPrice && p.originalPrice > p.price);
    if (allParam != null) return products;
    return products;
  }, [products, selectedCategoryId, saleParam, allParam]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PRODUCTS_PER_PAGE;
  const visibleProducts = filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);

  const saleProducts = useMemo(() =>
    products.filter((p) => p.originalPrice && p.originalPrice > p.price).slice(0, 5),
    [products]
  );
  const featuredProducts = useMemo(() =>
    products.filter((p) => p.featured || p.isFeatured).slice(0, 5),
    [products]
  );
  const displayFeatured = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 5);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  if (isLoading) {
    return (
      <div className="product-list-container">
        <div className="product-list-loading">
          <div className="loading-spinner"></div>
          <span>Đang tải sản phẩm...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list-container">
        <div className="product-list-error">
          <i className="fas fa-circle-exclamation"></i> Lỗi: {error}
        </div>
      </div>
    );
  }

  // ── CATEGORY VIEW ──
  if (selectedCategoryId != null || saleParam != null || allParam != null) {
    const isSaleView = saleParam != null;
    const isAllView = allParam != null;
    return (
      <div className="product-list-container">
        <div className="pl-breadcrumb">
          <button type="button" className="pl-breadcrumb-btn" onClick={() => navigate('/')}>Trang chủ</button>
          <i className="fas fa-chevron-right"></i>
          <button type="button" className="pl-breadcrumb-btn" onClick={() => navigate('/products')}>Tất cả sản phẩm</button>
          {isSaleView && (
            <>
              <i className="fas fa-chevron-right"></i>
              <span>Khuyến mãi</span>
            </>
          )}
          {isAllView && (
            <>
              <i className="fas fa-chevron-right"></i>
              <span>Tất cả sản phẩm</span>
            </>
          )}
          {selectedCategory && !isSaleView && !isAllView && (
            <>
              <i className="fas fa-chevron-right"></i>
              <span>{selectedCategory.name}</span>
            </>
          )}
        </div>

        <div className="pl-section-header">
          <h2 className="pl-section-title">
            {saleParam != null ? 'Khuyến mãi' : (allParam != null ? 'Tất cả sản phẩm' : (selectedCategory ? selectedCategory.name : 'Danh mục sản phẩm'))}
          </h2>
          <span className="pl-count">{filteredProducts.length} sản phẩm</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="product-list-empty">
            <i className="fas fa-box-open"></i>
            <p>Không có sản phẩm trong danh mục này.</p>
          </div>
        ) : (
          <>
            <div className="product-list">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length > PRODUCTS_PER_PAGE && (
              <div className="product-list-pagination" role="navigation" aria-label="Phân trang sản phẩm">
                <button
                  type="button"
                  className="product-list-pagination_btn"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                >
                  <i className="fas fa-chevron-left"></i> Trang trước
                </button>
                <div className="pagination-pages">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={`pagination-page-btn ${safePage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="product-list-pagination_btn"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                >
                  Trang sau <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // ── DEFAULT VIEW — sections ──
  return (
    <div className="product-list-container">

      {/* Đang giảm giá */}
      {saleProducts.length > 0 && (
        <section className="pl-section">
          <div className="pl-highlight pl-highlight--sale">
            <div className="pl-section-header">
              <div className="pl-section-title-wrap">
                <h2 className="pl-section-title">Flash Sale</h2>
              </div>
              <button
                type="button"
                className="pl-section-link"
                onClick={() => navigate('/products?sale=1')}
              >
                Xem tất cả <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            <div className="product-list">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sản phẩm nổi bật */}
      <section className="pl-section">
        <div className="pl-highlight pl-highlight--featured">
          <div className="pl-section-header">
            <div className="pl-section-title-wrap">
              <h2 className="pl-section-title">Sản phẩm nổi bật</h2>
            </div>
            <button
              type="button"
              className="pl-section-link"
              onClick={() => navigate('/products?all=1')}
            >
              Xem tất bộ <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          <div className="product-list">
            {displayFeatured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Theo từng danh mục */}
      {categories.map((cat) => {
        const catProducts = products
          .filter((p) => p.categoryid === cat.id)
          .slice(0, 5);
        if (catProducts.length === 0) return null;
        return (
          <section key={cat.id} className="pl-section">
            <div className="pl-section-header">
              <div className="pl-section-title-wrap">
                <h2 className="pl-section-title">{cat.name}</h2>
              </div>
              <button
                type="button"
                className="pl-section-link"
                onClick={() => navigate(`/products?category=${cat.id}`)}
              >
                Xem tất cả <i className="fas fa-arrow-right"></i>
              </button>
            </div>
                <div className="product-list">
                  {catProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
          </section>
        );
      })}

    </div>
  );
};

export default ProductList;
