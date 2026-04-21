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
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<DetailProduct />} />
          </Routes>
      <Footer />
    </>
  );
}

export default App;