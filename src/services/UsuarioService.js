import axios from 'axios';
const API_URL = 'http://localhost:8081/api/usuario';

class UsuarioService {
    getListaUsuarios() {
        return axios.get(API_URL); // Todos los usuarios
    }

    getUsuario(id) {
        return axios.get(API_URL + id);
    }

    crearUsuario(usuario) {
        return axios.post(API_URL, usuario);
    }

    actualizarUsuario(usuario) {
        return axios.put(API_URL, usuario);
    }

    deleteUsuario(id) {
        return axios.delete(API_URL+ "/" + id);
    }
}

const usuarioService = new UsuarioService();
export default usuarioService;