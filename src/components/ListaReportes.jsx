import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Button, Grid, Box } from "@mui/material";
import Navbar from "./Navbar";

import InformacionEmpresa from "./InformacionEmpresa";
import reporteService from "../services/ReporteService";
import empresaService from "../services/EmpresaService";
import { useParams, Link } from "react-router-dom";

function ListaReportes() {
    const useSectionMode = false;
    const secciones = ["Empresas", "Usuarios"];
    const seccionesRutas = ["/empresas", "/usuarios"];
    const seccionActual = "Empresa A";
    const [listaReportes, setReportes] = useState([]);
    const [infoEmpresa, setInfoEmpresa] = useState({});
    const { idEmpresa } = useParams();

    useEffect(() => {
        reporteService.getListaReportes(idEmpresa)
            .then(response => response.data)
            .then(data => setReportes(data))
            .catch(error => console.error('Error al obtener la lista de reportes:', error));

        empresaService.getEmpresa(idEmpresa)
            .then(response => response.data)
            .then(data => setInfoEmpresa(data))
            .catch(error => console.error('Error al obtener la información de la empresa:', error));
    });

    return (
        <>
            <Navbar useSectionMode={useSectionMode} secciones={secciones} seccionesRutas={seccionesRutas} seccionActual={seccionActual} />

            <Container>
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
                                            <Button variant="outlined" color="error" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1 }}>
                                                Eliminar Reporte
                                            </Button>
                                            <Button variant="outlined" color="cuaternary" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1 }}>
                                                Descargar Reporte
                                            </Button>
                                            <Button variant="outlined" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1 }}>
                                                Abrir Reporte
                                            </Button>

                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <Box bgcolor="#fff" sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, boxShadow: "0px -4px 6px rgba(0, 0, 0, 0.1)" }}>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
                    <Button variant="contained" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1, fontSize: "1.2rem" }}>
                        Crear Reporte
                    </Button>
                </Box>
            </Box>
        </>
    );
}

export default ListaReportes;