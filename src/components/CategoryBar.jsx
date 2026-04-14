import React from 'react';
import { Link } from 'react-router-dom';
import categories from '../../data/category.json'; // Import file JSON của bạn vào đây
import './CategoryBar.css'; // Import xíu CSS để làm hiệu ứng hover cho đẹp

const CategoryBar = () => {
  return (
    // Dùng class của Bootstrap: nền xanh đậm (custom), padding trên dưới (py-2)
    <nav className="category-bar py-2">
      <div className="container">
        {/* Dùng flexbox của Bootstrap để dàn hàng ngang, chia đều khoảng cách */}
        <ul className="nav d-flex justify-content-between align-items-center flex-nowrap overflow-auto hide-scroll">
          {categories.map((item) => (
            <li className="nav-item" key={item.id}>
              {/* Dùng Link để chuyển trang không bị load lại web */}
              <Link 
                to={`/category/${item.id}`} 
                className="nav-link text-white fw-medium category-link"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default CategoryBar;