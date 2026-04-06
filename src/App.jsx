import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

function App() {
  const location = useLocation();
  return (
    <>
 <Header />
  
  <Footer />
  
    </>
  );
}

export default App;