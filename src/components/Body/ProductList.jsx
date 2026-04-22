<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';
import sp1Img from '../../img/sp1.png';
import sp2Img from '../../img/sp2.png';
import sp3Img from '../../img/sp3.png';

const imageMap = {
  'sp1': sp1Img,
  'sp2': sp2Img,
  'sp3': sp3Img,
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

=======
import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';
import sp1Img from '../../img/sp1.png';
import sp2Img from '../../img/sp2.png';
import sp3Img from '../../img/sp3.png';

const imageMap = {
  'sp1': sp1Img,
  'sp2': sp2Img,
  'sp3': sp3Img,
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

>>>>>>> ce481ef9a097173fad57c95d7cb2382ecb71b341
export default ProductList;