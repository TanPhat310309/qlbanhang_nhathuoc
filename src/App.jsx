import { Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import HeaderGPT_4 from './components/Header/HeaderGPT_4';
import ProductList from './components/Body/ProductList';
import DetailProduct from './components/Body/DetailProduct';
import ChatBubble from './components/Body/ChatBubble';
import Cart from './components/Pages/Cart';
import LogIn from './components/Pages/LogIn';
import SignUp from './components/Pages/SignUp';
import Profile from './components/Pages/Profile';
import Admin from './components/Pages/Admin';
import Banner from './components/Body/Banner';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const location = useLocation();
  const hideChrome = location.pathname === '/admin';
   
  return (
    <>
      {!hideChrome && <HeaderGPT_4 />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Banner />
              <ProductList />
              <ChatBubble />
            </>
          }
        />
        <Route path="/product/:id" element={<DetailProduct/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      {!hideChrome && <Footer />}
    </>
  );
}

export default App;