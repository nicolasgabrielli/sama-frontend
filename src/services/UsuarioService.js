import axiosInstance from './AxiosConfig';
import { jwtDecode } from 'jwt-decode';

const API_URL = '/api/usuario';

const usuarioService = {
    getListaUsuarios: () => axiosInstance.get(API_URL),
    getUsuario: (id) => axiosInstance.get(`${API_URL}/${id}`),
    crearUsuario: (usuario) => axiosInstance.post(API_URL, usuario),
    actualizarUsuario: (usuario) => axiosInstance.put(API_URL, usuario),
    deleteUsuario: (id) => axiosInstance.delete(`${API_URL}/${id}`),
    listaRoles: ["Administrador", "Editor de Reporte", "Visualizador de Reporte", "Autorizador de Registro", "Autorizador de Reporte", "Auditor"],
    getUsuarioLogueado: () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (token && userId) {
            return usuarioService.getUsuario(userId);
        }
        return null;
    },
};

export default usuarioService;
