import axiosInstance from './AxiosConfig';

const API_URL = '/api/reporte/';
const API_URL2 = '/api/';

export default {
    obtenerListaReportes: (idEmpresa) => axiosInstance.get(`${API_URL}por-empresa/${idEmpresa}`),
    obtenerReporte: (id) => axiosInstance.get(`${API_URL}por-id/${id}`),
    crearReporte: (idEmpresa, reporte) => axiosInstance.post(`${API_URL}crear/${idEmpresa}`, reporte),
    actualizarReporte: (reporte, idReporte) => axiosInstance.put(`${API_URL}actualizar/${idReporte}`, reporte),
    eliminarReporte: (id) => axiosInstance.delete(`${API_URL}eliminar/${id}`),
    obtenerPresets: () => axiosInstance.get(`${API_URL}preset`),
    obtenerPreset: (id) => axiosInstance.get(`${API_URL}preset/${id}`),
    eliminarContenido: (idReporte, coordenadas) => axiosInstance.delete(`${API_URL}eliminar-contenido/${idReporte}`, { data: coordenadas }),
    obtenerCategorias: (idReporte) => axiosInstance.get(`${API_URL}categorias/${idReporte}`),
    obtenerSecciones: (idReporte, coordenadas) => axiosInstance.get(`${API_URL}secciones/${idReporte}`, coordenadas),
    obtenerCampos: (idReporte, coordenadas) => axiosInstance.get(`${API_URL}campos/${idReporte}`, coordenadas),
    obtenerEvidencias: (idReporte) => axiosInstance.get(`${API_URL2}evidencia/${idReporte}`),
    crearEvidencia: (idReporte, evidencia) => axiosInstance.post(`${API_URL2}evidencia/${idReporte}`, evidencia),
    eliminarEvidencia: (idEvidencia) => axiosInstance.delete(`${API_URL2}evidencia/${idEvidencia}`),
    obtenerUrlS3: (idEvidencia) => axiosInstance.get(`${API_URL2}evidencia/url/${idEvidencia}`),
    descargarEvidencia: (idEvidencia) => axiosInstance.get(`${API_URL2}evidencia/descargar/${idEvidencia}`),
    descargarReporte: (idReporte, formato) => axiosInstance.get(`${API_URL}${formato}/${idReporte}`, { responseType: 'blob' }),
    autorizarCampo: (idReporte, coordenadas) => axiosInstance.put(`${API_URL}autorizar/campo/${idReporte}`, coordenadas),
    autorizarReporte: (idReporte, coordenadas) => axiosInstance.put(`${API_URL}autorizar/all-campos/${idReporte}`, coordenadas),
    crearPreset: (data) => axiosInstance.post(`${API_URL}preset`, data),
    reescribirReporte: (idReporte, data) => axiosInstance.put(`${API_URL}actualizar/reescribir/${idReporte}`, data),
};