import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const login = async (credenciales) => {
    try {
        const response = await axios.post('/api/auth', credenciales);
        const { token } = response.data;
        const decodedToken = jwtDecode(token);

        localStorage.setItem('token', token);
        localStorage.setItem('userId', decodedToken.id);
        localStorage.setItem('userRol', decodedToken.rol);

    } catch (error) {
        console.error('Error durante el login:', error);
        throw error;
    }
};

export default {
    login,
};