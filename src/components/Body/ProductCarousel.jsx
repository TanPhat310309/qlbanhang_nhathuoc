import React, { useRef, useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import './ProductCarousel.css';

const ProductCarousel = ({ products }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const carousel = scrollRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => carousel.removeEventListener('scroll', checkScroll);
    }
  }, [products]);

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
      {showLeftArrow && (
        <button className="carousel-arrow carousel-arrow--left" onClick={scrollLeft} aria-label="Cuộn trái" title="Cuộn trái">
          <i className="fas fa-chevron-left"></i>
        </button>
      )}
      <div className="product-carousel" ref={scrollRef}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {showRightArrow && (
        <button className="carousel-arrow carousel-arrow--right" onClick={scrollRight} aria-label="Cuộn phải" title="Cuộn phải">
          <i className="fas fa-chevron-right"></i>
        </button>
      )}
    </div>
  );
};

export default ProductCarousel;
