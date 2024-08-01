import axiosInstance from './AxiosConfig';
const API_URL = '/api/empresa';

export default {
    getListaEmpresas: () => axiosInstance.get(`${API_URL}/nombres`),
    getEmpresa: (id) => axiosInstance.get(`${API_URL}/${id}`),
    crearEmpresa: (empresa) => axiosInstance.post(API_URL, empresa),
    actualizarEmpresa: (empresa) => axiosInstance.put(API_URL, empresa),
    eliminarEmpresa: (id) => axiosInstance.delete(`${API_URL}/${id}`)
};