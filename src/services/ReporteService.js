import axios from 'axios';
const API_URL = 'http://localhost:8081/api/reporte/';
const API_URL2 = 'http://localhost:8081/api/';

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

    obtenerEvidencias(idReporte) {
        return axios.get(API_URL2 + "evidencia/" + idReporte);
    }

    obtenerEvidencias(idReporte, coordenadas) {
        return axios.get(API_URL2 + "evidencia/" + idReporte, coordenadas);
    }

    crearEvidencia(idReporte, evidencia) {
        return axios.post(API_URL2 + "evidencia/" + idReporte, evidencia);
    }

    eliminarEvidencia(idEvidencia) {
        return axios.delete(API_URL2 + "evidencia/" + idEvidencia);
    }

    obtenerUrlS3(idEvidencia) {
        return axios.get(API_URL2 + "evidencia/url/" + idEvidencia);
    }

    descargarReporte = (idReporte, formato) => {
        return axios.get(API_URL + formato + "/" + idReporte, {
            responseType: 'blob',  // Asegura que la respuesta sea manejada como un blob
        });
    };

    autorizarCampo = (idReporte, coordenadas) => {
        return axios.put(API_URL + "autorizar/campo/" + idReporte, coordenadas);
    }

    crearPreset = (data) => {
        return axios.post(API_URL + "preset/", data);
    }
}

const reporteService = new ReporteService();
export default reporteService;