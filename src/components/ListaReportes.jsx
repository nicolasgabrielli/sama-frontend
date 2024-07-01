import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Link, useParams } from "react-router-dom";
import empresaService from "../services/EmpresaService";
import reporteService from "../services/ReporteService";
import InformacionEmpresa from "./InformacionEmpresa";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Loading from './Loading';

function ListaReportes() {
    const useSectionMode = false;
    const secciones = ["Empresas", "Usuarios"];
    const seccionesRutas = ["/empresas", "/usuarios"];
    const seccionActual = "Empresa A";
    const [listaReportes, setReportes] = useState([]);
    const [infoEmpresa, setInfoEmpresa] = useState({});
    const { idEmpresa } = useParams();
    const [openEliminarReporte, setOpenEliminarReporte] = useState(false);
    const [reporteAEliminar, setReporteAEliminar] = useState(null);
    const [openCrearReporte, setOpenCrearReporte] = useState(false);
    const [openUtilizarPreconfiguracion, setOpenUtilizarPreconfiguracion] = useState(false);
    const [openSinPreconfiguraciones, setOpenSinPreconfiguraciones] = useState(false);
    const [preconfiguracionSeleccionadaId, setPreconfiguracionSeleccionadaId] = useState(null);
    const [preconfiguraciones, setPreconfiguraciones] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [tituloReporte, setTituloReporte] = useState("");
    const [anioReporte, setAnioReporte] = useState(null);
    const [tituloReporteError, setTituloReporteError] = useState(false);
    const [anioReporteError, setAnioReporteError] = useState(false);
    const [openDescargarReporteDialog, setOpenDescargarReporteDialog] = useState(false);
    const [idReporte, setIdReporte] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleOpenCrearReporte = () => {
        setOpenCrearReporte(true);
        setCategorias([]);
    };

    const handleCloseCrearReporte = () => {
        setOpenCrearReporte(false);
        setCategorias([]);
        setAnioReporte(null);
        setTituloReporte("");
    };

    const handleTituloReporteChange = (event) => {
        setTituloReporte(event.target.value);
    };

    const handleOpenUtilizarPreconfiguracion = () => {
        setOpenUtilizarPreconfiguracion(true);
        handleCloseCrearReporte();
    };

    const handleCloseUtilizarPreconfiguracion = () => {
        setOpenUtilizarPreconfiguracion(false);
        setAnioReporte(null);
        setTituloReporte("");
        setPreconfiguracionSeleccionadaId(null);
    };

    const handlePreconfiguracionSeleccionadaChange = (event) => {
        setPreconfiguracionSeleccionadaId(event.target.value);
    };

    const handleOpenSinPreconfiguraciones = () => {
        setOpenSinPreconfiguraciones(true);
        handleCloseUtilizarPreconfiguracion();
        handleCloseCrearReporte();
    };

    const handleCloseSinPreconfiguraciones = () => {
        setOpenSinPreconfiguraciones(false);
        setAnioReporte(null);
        setTituloReporte("");
    };

    const handleOpenEliminarReporte = (reporteId) => {
        const reporte = listaReportes.find(reporte => reporte.id === reporteId);
        setReporteAEliminar(reporte);
        setOpenEliminarReporte(true);
    };

    // Función para crear un reporte con una preconfiguración / preset
    const handleUtilizarPreconfiguracion = () => {
        if (!tituloReporte || !anioReporte) {
            setTituloReporteError(!tituloReporte);
            setAnioReporteError(!anioReporte);
            return;
        }
        // El preset seleccionado está en preconfiguracionSeleccionadaId
        // El titulo del reporte está en tituloReporte
        reporteService.obtenerPreset(preconfiguracionSeleccionadaId)
            .then(response => response.data)
            .then(data => {
                const categorias = data.categorias;
                const reporte = {
                    titulo: tituloReporte,
                    anio: anioReporte,
                    categorias: categorias
                };
                setOpenUtilizarPreconfiguracion(false);
                setTituloReporte("");
                setAnioReporte(null);
                (async () => {
                    await reporteService.crearReporte(idEmpresa, reporte);
                    await fetchData();
                })();
            })
            .catch(error => console.error('Error al obtener la preconfiguración:', error));
    };

    // Función para crear un reporte sin preconfiguración / preset
    const handleCrearReporteSinPreconfiguracion = async () => {
        if (!tituloReporte || !anioReporte) {
            setTituloReporteError(!tituloReporte);
            setAnioReporteError(!anioReporte);
            return;
        }
        // El titulo del reporte está en tituloReporte
        const reporte = {
            titulo: tituloReporte,
            anio: anioReporte,
            categorias: [{
                titulo: "Nueva Categoría 1",
                secciones: []
            }]
        }
        setOpenSinPreconfiguraciones(false);
        setTituloReporte("");
        setAnioReporte(null);
        await reporteService.crearReporte(idEmpresa, reporte);
        await fetchData();
    };

    const handleOpenDescargarReporteDialog = (idReporte) => {
        setIdReporte(idReporte);
        setOpenDescargarReporteDialog(true);
    };

    // Función para eliminar el reporte
    const handleEliminarReporte = async (idReporte) => {
        await reporteService.eliminarReporte(idReporte);
        await fetchData();
        setOpenEliminarReporte(false);
        window.location.reload();
    };

    // Función para descargar el reporte en un formato específico.
    const handleDescargarReporte = async (formato) => {
        try {
            const response = await reporteService.descargarReporte(idReporte, formato);

            // Verificar la estructura de la respuesta
            console.log('Response:', response);

            if (!response || !response.data) {
                throw new Error('No se recibió una respuesta válida del servidor.');
            }

            const headers = response.headers || {};
            console.log('Response headers:', headers);

            // Determinar el tipo de contenido basado en el formato
            let contentType;
            let extension;
            if (formato === 'pdf') {
                contentType = 'application/pdf';
                extension = 'pdf';
            } else if (formato === 'word') {
                contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                extension = 'docx';
            } else {
                throw new Error('Formato no soportado.');
            }

            // Convertir la respuesta a un blob
            const blob = new Blob([response.data], { type: contentType });

            if (formato === 'pdf') {
                // Crear una URL para el blob y abrirla en una nueva pestaña para PDFs
                const url = URL.createObjectURL(blob);
                window.open(url);
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 1000);
            } else if (formato === 'word') {
                // Crear una URL para el blob y simular un clic para descargar el archivo para Word
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `reporte.${extension}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error al descargar el reporte:', error);
        }
        setOpenDescargarReporteDialog(false);
        setIdReporte(null);
    };

    // Función para obtener la lista de reportes, preconfiguraciones y la información de la empresa
    const fetchData = async () => {
        setLoading(true);
        try {
            await reporteService.obtenerListaReportes(idEmpresa)
                .then(response => response.data)
                .then(data => {
                    if (data) {
                        setReportes(data);
                    } else {
                        setReportes([]);
                    }
                })
                .catch(error => console.error('Error al obtener la lista de reportes:', error));
    
            await reporteService.obtenerPresets()
                .then(response => response.data)
                .then(data => {
                    if (data) {
                        setPreconfiguraciones(data);
                    } else {
                        setPreconfiguraciones([]);
                    }
                })
                .catch(error => console.error('Error al obtener la lista de preconfiguraciones:', error));
    
            await empresaService.getEmpresa(idEmpresa)
                .then(response => response.data)
                .then(data => setInfoEmpresa(data))
                .catch(error => console.error('Error al obtener la información de la empresa:', error));
        } catch (error) {
            console.error('Error al obtener la información:', error);
        }
        setLoading(false);
    };
    

    // Cargar la lista de reportes, preconfiguraciones y la información de la empresa al cargar el componente
    useEffect(() => {
        setLoading(true);
        (async () => {
            await fetchData();
            setLoading(false);
        })();
    }, []);

    return (
        <>
            <Navbar useSectionMode={useSectionMode} secciones={secciones} seccionesRutas={seccionesRutas} seccionActual={seccionActual} />
            {loading && (
                <Loading />
            )}
            {!loading && (
                <>
                    <Container sx={{ pb: "100px" }}>
                        <Grid container spacing={2}>
                            {/*Informacion empresa*/}
                            <InformacionEmpresa infoEmpresa={infoEmpresa} />
                            {/*Lista de reportes*/}
                            <Grid item xs={12} md={9}>
                                <Paper sx={{ mt: 2, p: 2 }}>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            <Typography variant="h4" color="primary" fontWeight="bold" sx={{ mb: 2 }}>Lista de Reportes</Typography>
                                        </Grid>
                                        <Grid item xs={6} container justifyContent="flex-end">
                                            <Link to="/empresas">
                                                <Button
                                                    variant="contained"
                                                    sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1, fontSize: "1.1rem", maxHeight: 0.7 }}
                                                    startIcon={<ArrowBackIcon />}
                                                >
                                                    Volver
                                                </Button>
                                            </Link>
                                        </Grid>
                                    </Grid>
                                    {listaReportes.map((reporte) => (
                                        <Box key={reporte.id} sx={{ pl: 2, pr: 2 }}>
                                            <Grid container alignItems="center" justifyContent="space-between" borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, mb: 1, py: 1 }}>
                                                <Grid item xs={4}>
                                                    <Typography variant="h5" color={"#000000"} sx={{ fontFamily: "Segoe UI" }}>{reporte.titulo + " " + reporte.anio}</Typography>
                                                    <Typography variant="body2">Fecha creación: {reporte.fechaCreacion}</Typography>
                                                    <Typography variant="body2">Fecha modificación: {reporte.fechaModificacion}</Typography>
                                                    <Typography variant="body2">Estado: {reporte.estado}</Typography>
                                                </Grid>
                                                <Grid item xs={8} container justifyContent="flex-end" spacing={1}>
                                                    <Button variant="outlined" color="error" value={reporte.id} onClick={() => handleOpenEliminarReporte(reporte.id)} sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1 }}>
                                                        Eliminar Reporte
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="cuaternary"
                                                        sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1 }}
                                                        onClick={() => handleOpenDescargarReporteDialog(reporte.id)}
                                                    >
                                                        Descargar Reporte
                                                    </Button>
                                                    <Link to={`${reporte.id}`}>
                                                        <Button variant="outlined" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1 }}>
                                                            Abrir Reporte
                                                        </Button>
                                                    </Link>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    ))}
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>

                    <Box bgcolor="#fff" sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, boxShadow: "0px -4px 6px rgba(0, 0, 0, 0.1)", height: '80px' }}>
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
                            <Button variant="contained" onClick={handleOpenCrearReporte} sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1, fontSize: "1.2rem" }}>
                                Crear Reporte
                            </Button>
                        </Box>
                    </Box>

                    {/* Diálogo de confirmación de eliminación */}
                    <Dialog open={openEliminarReporte} onClose={() => setOpenEliminarReporte(false)}>
                        <DialogContent>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 1 }}>Eliminar Reporte</Typography>
                                </Grid>
                                <Grid item xs={12} container justifyContent="center" sx={{ mt: 2 }}>
                                    <Typography variant="body1">
                                        {reporteAEliminar ? `¿Está seguro que desea eliminar el reporte "${reporteAEliminar.titulo} ${reporteAEliminar.anio}"?` : "¿Está seguro que desea eliminar el reporte?"}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={reporteAEliminar ? () => handleEliminarReporte(reporteAEliminar.id) : () => setOpenEliminarReporte(false)}
                                color="error" variant="contained">
                                Eliminar
                            </Button>
                            <Button onClick={() => setOpenEliminarReporte(false)} color="primary" variant="outlined">
                                Cancelar
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Diálogo de creación de reporte */}
                    <Dialog open={openCrearReporte} onClose={handleCloseCrearReporte}>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 1 }}>Crear Reporte</Typography>
                                </Grid>
                                <Grid item xs={6} container justifyContent="flex-end" sx={{ mb: 1 }}>
                                    <IconButton onClick={handleCloseCrearReporte} disableRipple><CloseIcon /></IconButton>
                                </Grid>
                                <Grid item xs={12} container justifyContent={"center"}>
                                    <Typography variant="body1" borderColor={"secondary"}>
                                        ¿Desea utilizar una preconfiguración para el reporte?
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} container alignItems={"center"} justifyContent={"center"}>
                                    <Button variant="outlined" color="cuaternary" onClick={handleOpenUtilizarPreconfiguracion} sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 2 }}>
                                        Sí
                                    </Button>
                                    <Button variant="outlined" color="error" onClick={handleOpenSinPreconfiguraciones} sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic" }}>
                                        No
                                    </Button>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Grid container>
                                <Grid item xs={4} container justifyContent="flex-start">
                                    <Typography variant="body1" color="primary" sx={{ ml: 2, fontStyle: "italic", fontWeight: "bold" }}>
                                        {infoEmpresa.nombre}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </DialogActions>
                    </Dialog>

                    {/* Diálogo de utilización de Preconfiguración */}
                    <Dialog open={openUtilizarPreconfiguracion} onClose={handleCloseUtilizarPreconfiguracion}>
                        <DialogContent>
                            <Grid container spacing={2} sx={{ mt: -3 }}>
                                <Grid item xs={8}>
                                    <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 1 }}>Preconfiguración</Typography>
                                </Grid>
                                <Grid item xs={4} container justifyContent="flex-end" sx={{ mb: 2 }}>
                                    <IconButton onClick={handleCloseUtilizarPreconfiguracion} disableRipple><CloseIcon /></IconButton>
                                </Grid>
                                <Grid item xs={12} container>
                                    <Typography variant="body1">
                                        Introduzca el título del reporte:
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} container justifyContent={"center"} sx={{ mb: 2 }}>
                                    <TextField
                                        label="Titulo del Reporte"
                                        variant="outlined"
                                        fullWidth
                                        value={tituloReporte}
                                        onChange={handleTituloReporteChange}
                                        error={tituloReporteError}
                                        helperText={tituloReporteError ? "Este campo es obligatorio" : ""}
                                    />
                                </Grid>
                                <Grid item xs={12} container>
                                    <Typography variant="body1">
                                        Introduzca el año del reporte:
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} container justifyContent="center" sx={{ mb: 2 }}>
                                    <TextField
                                        label="Año del Reporte"
                                        variant="outlined"
                                        fullWidth
                                        value={anioReporte}
                                        onChange={(event) => setAnioReporte(event.target.value)}
                                        error={anioReporteError}
                                        helperText={anioReporteError ? "Este campo es obligatorio" : ""}
                                    />
                                </Grid>
                                <Grid item xs={12} container >
                                    <Typography variant="body1">
                                        Seleccione una preconfiguración para el reporte:
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} container justifyContent="center" sx={{ mb: 2 }}>
                                    <FormControl fullWidth>
                                        <InputLabel>Preconfiguración</InputLabel>
                                        <Select
                                            label="Preconfiguración"
                                            value={preconfiguracionSeleccionadaId}
                                            onChange={handlePreconfiguracionSeleccionadaChange}
                                            fullWidth
                                        >
                                            {preconfiguraciones && preconfiguraciones.length > 1 && preconfiguraciones.map((preconfiguracion) => (
                                                <MenuItem value={preconfiguracion.id}>{preconfiguracion.titulo}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Grid container>
                                <Grid item xs={4} container justifyContent="flex-start">
                                    <Typography variant="body1" color="primary" sx={{ ml: 2, fontStyle: "italic", fontWeight: "bold" }}>
                                        {infoEmpresa.nombre}
                                    </Typography>
                                </Grid>
                                <Grid item xs={8} container justifyContent="flex-end">
                                    <Button
                                        onClick={handleUtilizarPreconfiguracion}
                                        color="primary"
                                        variant="contained"
                                        sx={{ textTransform: "none", fontStyle: "italic", fontSize: "1rem" }}
                                        disabled={!tituloReporte || !anioReporte || !preconfiguracionSeleccionadaId}
                                    >
                                        Crear Reporte
                                    </Button>
                                </Grid>
                            </Grid>
                        </DialogActions>
                    </Dialog>

                    {/* Diálogo sin Preconfiguraciones */}
                    <Dialog open={openSinPreconfiguraciones} onClose={handleCloseSinPreconfiguraciones}>
                        <DialogContent>
                            <Grid container spacing={2} sx={{ mt: -3 }}>
                                <Grid item xs={8}>
                                    <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 1 }}>Crear Reporte</Typography>
                                </Grid>
                                <Grid item xs={4} container justifyContent="flex-end" sx={{ mb: 2 }}>
                                    <IconButton onClick={handleCloseSinPreconfiguraciones} disableRipple><CloseIcon /></IconButton>
                                </Grid>
                                <Grid item xs={12} container>
                                    <Typography variant="body1">
                                        Introduzca el título del reporte:
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} container justifyContent={"center"} sx={{ mb: 2 }}>
                                    <TextField
                                        label="Titulo del Reporte"
                                        variant="outlined"
                                        fullWidth
                                        value={tituloReporte}
                                        onChange={handleTituloReporteChange}
                                        error={tituloReporteError}
                                        helperText={tituloReporteError ? "Este campo es obligatorio" : ""}
                                    />
                                </Grid>
                                <Grid item xs={12} container>
                                    <Typography variant="body1">
                                        Introduzca el año del reporte:
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} container justifyContent="center" sx={{ mb: 2 }}>
                                    <TextField
                                        label="Año del Reporte"
                                        variant="outlined"
                                        fullWidth
                                        value={anioReporte}
                                        onChange={(event) => setAnioReporte(event.target.value)}
                                        error={anioReporteError}
                                        helperText={anioReporteError ? "Este campo es obligatorio" : ""}
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Grid container>
                                <Grid item xs={4} container justifyContent="flex-start">
                                    <Typography variant="body1" color="primary" sx={{ ml: 2, fontStyle: "italic", fontWeight: "bold" }}>
                                        {infoEmpresa.nombre}
                                    </Typography>
                                </Grid>
                                <Grid item xs={8} container justifyContent="flex-end">
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={handleCrearReporteSinPreconfiguracion}
                                        sx={{ textTransform: "none", fontStyle: "italic", fontSize: "1rem" }}
                                        disabled={!tituloReporte || !anioReporte}
                                    >
                                        Crear Reporte
                                    </Button>
                                </Grid>
                            </Grid>
                        </DialogActions>
                    </Dialog>

                    {/* Diálogo de descargar reporte */}
                    <Dialog open={openDescargarReporteDialog} onClose={() => setOpenDescargarReporteDialog(false)} maxWidth="md" fullWidth>
                        {/* Contenido del diálogo */}
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 1 }}>Descargar Reporte</Typography>
                                </Grid>
                                <Grid item xs={4} container justifyContent="flex-end" sx={{ mb: 2 }}>
                                    <IconButton onClick={() => setOpenDescargarReporteDialog(false)} disableRipple><CloseIcon /></IconButton>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                                <Typography variant="h6">Seleccione el formato de descarga:</Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mt: 2, ml: 2 }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1rem", mr: 2 }}
                                    onClick={() => handleDescargarReporte("pdf")}
                                    startIcon={<CloudDownloadIcon />}
                                >
                                    Descargar PDF
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1rem", mr: 2 }}
                                    onClick={() => handleDescargarReporte("word")}
                                    startIcon={<CloudDownloadIcon />}
                                >
                                    Descargar Word
                                </Button>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Grid container>
                                <Grid item xs={12} container justifyContent="flex-end">
                                    <Button color="secondary" variant="text" onClick={() => setOpenDescargarReporteDialog(false)}>
                                        Cancelar
                                    </Button>
                                </Grid>
                            </Grid>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </>
    );
}

export default ListaReportes;