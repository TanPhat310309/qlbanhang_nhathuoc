import { Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import HeaderGPT_4 from './components/Header/HeaderGPT_4';
import ProductList from './components/Body/ProductList';
import DetailProduct from './components/Body/DetailProduct';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const location = useLocation();
  
  return (
    <>
      <HeaderGPT_4 />
      {/* Khai báo Routes để điều hướng */}
<ProductList />
  <Footer />
    </>
  );
}

export default App;