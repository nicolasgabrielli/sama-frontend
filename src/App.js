import './App.css';
import { Container, Typography } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Empresas from './components/Empresas';
import Usuarios from './components/Usuarios';
import CrearUsuario from './components/CrearUsuario';

function App() {
  return (
    <div style={{ backgroundColor: "#f0f0f0", minHeight: "100vh" }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/empresas" element={<Empresas />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/crearUsuario" element={<CrearUsuario />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
