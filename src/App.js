import './App.css';
import { ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Empresas from './components/Empresas';
import Usuarios from './components/Usuarios';
import CrearUsuario from './components/CrearUsuario';
import Reporte from './components/Reporte';
import ListaReportes from './components/ListaReportes';
import CrearEmpresa from './components/CrearEmpresa';
import Login from './components/Login';


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

  return (
    <div style={{ backgroundColor: "#f0f0f0", minHeight: "100vh" }}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Empresas />} />
            <Route path="/empresas" element={<Empresas />} />
            <Route path="/empresas/crear" element={<CrearEmpresa />} />
            <Route path="/empresas/:idEmpresa/reportes/:idReporte" element={<Reporte />} />
            <Route path="/empresas/:idEmpresa/reportes" element={<ListaReportes />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/usuarios/crear" element={<CrearUsuario />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
