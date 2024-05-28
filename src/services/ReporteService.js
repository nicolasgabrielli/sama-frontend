import axios from 'axios';
const API_URL = 'http://localhost:8081/api/reporte/';

class ReporteService {
    obtenerListaReportes(idEmpresa) {
        return axios.get(API_URL + "por-empresa/" + idEmpresa);
    }

    obtenerReporte(id) {
        return axios.get(API_URL + "por-id/" + id);
    }

    crearReporte(idEmpresa, reporte) {
        return axios.post(API_URL + "crear/" + idEmpresa, reporte);
    }

    actualizarReporte(reporte, idReporte) {
        return axios.put(API_URL + "actualizar/" + idReporte, reporte);
    }

    eliminarReporte(id) {
        return axios.delete(API_URL +"eliminar/" + id);
    }

    obtenerPresets() {
        return axios.get(API_URL + "preset");
    }

    obtenerPreset(id) {
        return axios.get(API_URL + "preset/" + id);
    }

    eliminarContenido(idReporte, coordenadas) {
        return axios.delete(API_URL + "eliminar-contenido/" + idReporte, {
            data: coordenadas
        });
    }

    obtenerCategorias(idReporte) {
        return axios.get(API_URL + "categorias/" + idReporte);
    }

    obtenerSecciones(idReporte, coordenadas) {
        return axios.get(API_URL + "secciones/" + idReporte, coordenadas);
    }

    obtenerCampos(idReporte, coordenadas) {
        return axios.get(API_URL + "campos/" + idReporte, coordenadas);
    }
}

const reporteService = new ReporteService();
export default reporteService;