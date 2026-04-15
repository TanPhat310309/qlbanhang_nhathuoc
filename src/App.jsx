import { Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import '@fortawesome/fontawesome-free/css/all.min.css';
import HeaderGPT_4 from './components/Header/HeaderGPT_4';

const products = [
  { "id": 1, "name": "Amoxicillin 500mg", "categoryid": 1, "price": 50000, "image": "src/img/amoxicillin500mg.png" },
  { "id": 2, "name": "Augmentin 1g", "categoryid": 1, "price": 180000, "image": "src/img/augmentin1g.png" },
];

function App() {
  const location = useLocation();

  return (
    <>
      <HeaderGPT_4 />
      
      {}
      <main>
        {products.map((item) => (
          <img key={item.id} src={item.image} alt="" />
        ))}
      </main>

      <Footer />
    </>
  );
}

export default App;
