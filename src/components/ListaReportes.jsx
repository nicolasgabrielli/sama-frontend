import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

import { Link, useParams } from "react-router-dom";
import empresaService from "../services/EmpresaService";
import reporteService from "../services/ReporteService";
import InformacionEmpresa from "./InformacionEmpresa";

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
                reporteService.crearReporte(idEmpresa, reporte);
            })
            .catch(error => console.error('Error al obtener la preconfiguración:', error));
    };

    // Función para crear un reporte sin preconfiguración / preset
    const handleCrearReporteSinPreconfiguracion = () => {
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
        reporteService.crearReporte(idEmpresa, reporte);
    };

    // Función para eliminar el reporte
    const handleEliminarReporte = (idReporte) => {
        reporteService.eliminarReporte(idReporte);
        setOpenEliminarReporte(false);
    };

    useEffect(() => {
        reporteService.obtenerListaReportes(idEmpresa)
            .then(response => response.data)
            .then(data => setReportes(data))
            .catch(error => console.error('Error al obtener la lista de reportes:', error));

        reporteService.obtenerPresets()
            .then(response => response.data)
            .then(data => setPreconfiguraciones(data))
            .catch(error => console.error('Error al obtener la lista de preconfiguraciones:', error));

        empresaService.getEmpresa(idEmpresa)
            .then(response => response.data)
            .then(data => setInfoEmpresa(data))
            .catch(error => console.error('Error al obtener la información de la empresa:', error));
    });

    return (
        <>
            <Navbar useSectionMode={useSectionMode} secciones={secciones} seccionesRutas={seccionesRutas} seccionActual={seccionActual} />

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
                                        <Button variant="outlined" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1, fontSize: "1.1rem", maxHeight: 0.7 }}>
                                            Volver
                                        </Button>
                                    </Link>
                                </Grid>
                            </Grid>
                            {listaReportes.map((reporte) => (
                                <Box key={reporte.id} sx={{ pl: 2, pr: 2 }}>
                                    <Grid container alignItems="center" justifyContent="space-between" borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, mb: 1, py: 1 }}>
                                        <Grid item xs={4}>
                                            <Typography variant="h5" color={"#000000"} sx={{ fontFamily: "Segoe UI" }}>{"Reporte " + reporte.titulo + " " + reporte.anio}</Typography>
                                            <Typography variant="body2">Fecha creación: {reporte.fechaCreacion}</Typography>
                                            <Typography variant="body2">Fecha modificación: {reporte.fechaModificacion}</Typography>
                                            <Typography variant="body2">Estado: {reporte.estado}</Typography>
                                        </Grid>
                                        <Grid item xs={8} container justifyContent="flex-end" spacing={1}>
                                            <Button variant="outlined" color="error" value={reporte.id} onClick={() => handleOpenEliminarReporte(reporte.id)} sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1 }}>
                                                Eliminar Reporte
                                            </Button>
                                            <Button variant="outlined" color="cuaternary" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1 }}>
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
                                    {Array.isArray(preconfiguraciones) && preconfiguraciones.map((preconfiguracion) => (
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
        </>
    );
}

export default ListaReportes;