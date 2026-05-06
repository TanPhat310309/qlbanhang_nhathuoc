import { Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import HeaderGPT_4 from './components/Header/HeaderGPT_4';
import ProductList from './components/Body/ProductList';
import DetailProduct from './components/Body/DetailProduct';
import ChatBubble from './components/Body/ChatBubble';
import Cart from './components/Pages/Cart';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const location = useLocation();
  const hideChrome = 
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/admin';
   
  return (
    <>
      {!hideChrome && <HeaderGPT_4 />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <ProductList />
              <ChatBubble />
            </>
          }
        />
        <Route path="/product/:id" element={<DetailProduct/>} />
        <Route path="/cart" element={<Cart/>} />
      </Routes>
      {!hideChrome && <Footer />}
    </>
  );
}

export default App;