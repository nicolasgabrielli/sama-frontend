import './App.css';
import { Container, Typography } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Empresas from './components/Empresas';
import Usuarios from './components/Usuarios';
import CrearUsuario from './components/CrearUsuario';
import Reporte from './components/Reporte';
import ListaReportes from './components/ListaReportes';
import CrearEmpresa from './components/CrearEmpresa';

function App() {
  return (
    <div style={{ backgroundColor: "#f0f0f0", minHeight: "100vh" }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/empresas" element={<Empresas />} />
          <Route path="/empresas/crear" element={<CrearEmpresa />} />
          <Route path="/empresas/:idEmpresa/reportes/:idReporte" element={<Reporte />} />
          <Route path="/empresas/:idEmpresa/reportes" element={<ListaReportes />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/usuarios/crear" element={<CrearUsuario />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
