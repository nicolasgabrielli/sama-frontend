import axios from 'axios';

// Crear una instancia de axios
const axiosInstance = axios.create();

// Interceptor para añadir el token a las cabeceras de cada petición
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Interceptor de respuestas para manejar errores de autenticación y autorización
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.clear();   // En caso de error se limpia la sesión.
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;