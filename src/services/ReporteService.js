import axios from 'axios';
const API_URL = 'http://localhost:8081/api/reporte/';

class ReporteService {
    getListaReportes(idEmpresa) {
        return axios.get(API_URL+"por-empresa/"+idEmpresa); // Tuplas (año, idReporte)
    }

    getReporte(id) {
        return axios.get(API_URL + id);
    }

    crearReporte(reporte) {
        return axios.post(API_URL, reporte);
    }

    actualizarReporte(reporte) {
        return axios.put(API_URL, reporte);
    }

    deleteReporte(id) {
        return axios.delete(API_URL + id);
    }
}

const reporteService = new ReporteService();
export default reporteService;