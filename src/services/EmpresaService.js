import axios from 'axios';
const API_URL = 'http://localhost:8081/api/empresa/';

class EmpresaService {
    getEmpresas() {
        return axios.get(API_URL);
    }

    getEmpresa(id) {
        return axios.get(API_URL + id);
    }

    createEmpresa(empresa) {
        return axios.post(API_URL, empresa);
    }

    updateEmpresa(empresa) {
        return axios.put(API_URL + empresa.id, empresa);
    }

    deleteEmpresa(id) {
        return axios.delete(API_URL + id);
    }
}

const empresaService = new EmpresaService();
export default empresaService;