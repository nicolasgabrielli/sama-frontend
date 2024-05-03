import './App.css';
import { Container, Typography } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Empresas from './components/Empresas';

function App() {
  return (
    <div style={{ backgroundColor: "#f0f0f0", minHeight: "100vh" }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/empresas" element={<Empresas />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
