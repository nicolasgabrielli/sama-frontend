import axiosInstance from './AxiosConfig';

const API_URL = '/api/usuario';

const usuarioService = {
    getListaUsuarios: () => axiosInstance.get(API_URL),
    getUsuario: (id) => axiosInstance.get(`${API_URL}/${id}`),
    crearUsuario: (usuario) => axiosInstance.post(API_URL, usuario),
    actualizarUsuario: (id, usuario) => axiosInstance.put(API_URL, usuario, {
        headers: {
            'Content-Type': 'application/json'
        }
    }),
    deleteUsuario: (id) => axiosInstance.delete(`${API_URL}/${id}`),
    listaRoles: ["Administrador", "Editor de Reporte", "Usuario Indicador", "Autorizador de Registro", "Autorizador de Reporte", "Auditor"],
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
