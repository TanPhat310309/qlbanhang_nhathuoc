import React, { useRef } from 'react';
import ProductCard from './ProductCard';
import './ProductCarousel.css';

const ProductCarousel = ({ products }) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="product-carousel-wrapper">
      <button className="carousel-arrow carousel-arrow--left" onClick={scrollLeft} aria-label="Cuộn trái">
        <i className="fas fa-chevron-left"></i>
      </button>
      <div className="product-carousel" ref={scrollRef}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <button className="carousel-arrow carousel-arrow--right" onClick={scrollRight} aria-label="Cuộn phải">
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default ProductCarousel;
