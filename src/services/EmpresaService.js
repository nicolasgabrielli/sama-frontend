import axios from 'axios';
const API_URL = 'http://localhost:8081/api/empresa';

class EmpresaService {
    getListaEmpresas() {
        return axios.get(API_URL+"/nombres"); // Tuplas de id y nombre
    }

    getEmpresa(id) {
        return axios.get(API_URL + "/" + id);
    }

    crearEmpresa(empresa) {
        return axios.post(API_URL, empresa);
    }

    actualizarEmpresa(empresa) {
        return axios.put(API_URL, empresa);
    }

    eliminarEmpresa(id) {
        return axios.delete(API_URL + "/" + id);
    }
}

const empresaService = new EmpresaService();
export default empresaService;