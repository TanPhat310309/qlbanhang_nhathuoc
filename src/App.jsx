import { Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import HeaderGPT_4 from './components/Header/HeaderGPT_4';
import ProductList from './components/Body/ProductList'; // Nhớ import component
import DetailProduct from './components/Body/DetailProduct'; // Nhớ import component
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const location = useLocation();
  
  return (
    <>
      <HeaderGPT_4 />
      {/* Khai báo Routes để điều hướng */}
<ProductList />
  <DetailProduct />
    </>
  );
}

export default App;