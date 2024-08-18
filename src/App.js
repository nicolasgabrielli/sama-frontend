import './App.css';
import { ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Empresas from './components/Empresas';
import Usuarios from './components/Usuarios';
import CrearUsuario from './components/CrearUsuario';
import Reporte from './components/Reporte';
import ListaReportes from './components/ListaReportes';
import CrearEmpresa from './components/CrearEmpresa';
import Login from './components/Login';
import usuarioService from './services/UsuarioService';
import PerfilUsuario from './components/PerfilUsuario';
import EditarPerfilEmpresa from './components/EditarPerfilEmpresa';

const theme = createTheme({
  palette: {
    primary: {
      main: '#528df3',
    },
    secondary: {
      main: '#A4A4A4',
    },
    terciary: {
      main: '#FF6060',
    },
    cuaternary: {
      main: '#66BB71',
    },
  },
});

function App() {

  const [usuarioLogeado, setUsuarioLogeado] = useState(null);
  const [rol, setRol] = useState(2);

  useEffect(() => {
    window.addEventListener('error', e => {
      if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
        const resizeObserverErrDiv = document.getElementById(
          'webpack-dev-server-client-overlay-div'
        );
        const resizeObserverErr = document.getElementById(
          'webpack-dev-server-client-overlay'
        );
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute('style', 'display: none');
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute('style', 'display: none');
        }
      }
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await usuarioService.getUsuarioLogueado();
        setUsuarioLogeado(response.data);
        setRol(response.data.rol);
      } catch (error) {
        console.error('Error al obtener el usuario logueado:', error);
      }
    })();
  }, []);

  return (
    <div style={{ backgroundColor: "#f0f0f0", minHeight: "100vh" }}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={usuarioLogeado ? <Empresas /> : <Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/empresas" element={usuarioLogeado ? <Empresas /> : <Login />} />
            <Route path="/empresas/crear" element={(parseInt(rol) === 0) ? <CrearEmpresa /> : <Navigate to="/" />} />
            <Route path="/empresas/:idEmpresa/reportes/:idReporte" element={usuarioLogeado ? <Reporte /> : <Login />} />
            <Route path="/empresas/:idEmpresa/reportes" element={usuarioLogeado ? <ListaReportes /> : <Login />} />
            <Route path="/usuarios" element={(parseInt(rol) === 0) ? <Usuarios /> : <Navigate to="/" />} />
            <Route path="/usuarios/crear" element={(parseInt(rol) === 0) ? <CrearUsuario /> : <Navigate to="/" />} />
            <Route path="/usuarios/:id" element={<PerfilUsuario />} />
            <Route path="/empresas/:idEmpresa" element={<EditarPerfilEmpresa />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
