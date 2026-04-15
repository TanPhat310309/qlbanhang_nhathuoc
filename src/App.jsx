import { Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import '@fortawesome/fontawesome-free/css/all.min.css';
import HeaderGPT_4 from './components/Header/HeaderGPT_4';
import DetailProduct from './components/Body/DetailProduct';
function App() {
  const location = useLocation();
  return (
    <>
 <HeaderGPT_4 />
<DetailProduct />
  <Footer />
  
    </>
  );
}

export default App;
