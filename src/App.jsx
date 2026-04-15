[
  { "id": 1, "name": "Amoxicillin 500mg", "categoryid": 1, "price": 50000, "image": "src/img/amoxicillin500mg.png" },
  { "id": 2, "name": "Augmentin 1g", "categoryid": 1, "price": 180000, "image": "src/img/augmentin1g.png" },
  { "id": 3, "name": "Zinnat 500mg", "categoryid": 1, "price": 250000, "image": "src/img/zinnat500g.png" }
]


---

### Bước 2: Import vào `App.jsx`
Bây giờ qua file `App.jsx`, bạn chỉ cần dùng lệnh `import` gọi tên nó vào là xài được ngay:

```jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import '@fortawesome/fontawesome-free/css/all.min.css';
import HeaderGPT_4 from './components/Header/HeaderGPT_4';

// Import trực tiếp file JSON vào đây! (Giả sử data.json nằm cùng thư mục với App.jsx)
import products from './products.json';

function App() {
  const location = useLocation();

  return (
    <>
      <HeaderGPT_4 />
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '20px' }}>
        {products.map((item) => (
          <img 
            key={item.id} 
            src={item.image} 
            alt={item.name} 
            style={{ width: '150px', height: '150px', objectFit: 'contain', border: '1px solid #ccc' }} 
          />
        ))}
      </div>

      <Footer />
    </>
  );
}

export default App;
