import axios from 'axios';
const API_URL = 'http://localhost:8081/api/reporte/';

class ReporteService {
    getListaReportes(idEmpresa) {
        return axios.get(API_URL + "por-empresa/" + idEmpresa); // Tuplas (año, idReporte)
    }

    getReporte(id) {
        return axios.get(API_URL + "por-id/" + id);
    }

    crearReporte(idEmpresa, reporte) {
        return axios.post(API_URL + "crear/" + idEmpresa, reporte);
    }

    actualizarReporte(reporte, idReporte) {
        return axios.put(API_URL + "actualizar/" + idReporte, reporte);
    }

    deleteReporte(id) {
        return axios.delete(API_URL +"eliminar/" + id);
    }

    getPresets() {
        return axios.get(API_URL + "preset");
    }

    getPreset(id) {
        return axios.get(API_URL + "preset/" + id);
    }

    deleteContenido(idReporte, contenido) {
        return axios.put(API_URL + "eliminar-contenido/" + idReporte, contenido);
    }
}

const reporteService = new ReporteService();
export default reporteService;