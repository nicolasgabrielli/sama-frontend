import axiosInstance from './AxiosConfig';
const API_URL = '/api/usuario';

export default {
    getListaUsuarios: () => axiosInstance.get(API_URL),
    getUsuario: (id) => axiosInstance.get(`${API_URL}${id}`),
    crearUsuario: (usuario) => axiosInstance.post(API_URL, usuario),
    actualizarUsuario: (usuario) => axiosInstance.put(API_URL, usuario),
    deleteUsuario: (id) => axiosInstance.delete(`${API_URL}/${id}`)
};