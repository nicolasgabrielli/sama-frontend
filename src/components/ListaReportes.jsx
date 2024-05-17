import React from "react";
import { Container, Typography, Paper, Button, Grid, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import Navbar from "./Navbar";

function ListaReportes() {
    const useSectionMode = false;
    const secciones = ["Empresa A", "Empresa B", "Empresa C", "Empresa D"];
    const seccionesRutas = ["/empresas/:idEmpresa/reportes", "/empresas/:idEmpresa/reportes", "/empresas/:idEmpresa/reportes", "/empresas/:idEmpresa/reportes"];
    const seccionActual = "Empresa A";

    // lista de reportes de prueba
    const listaReportes = [
        { id: 1, titulo: "Reporte 1", fecha: "2024-05-07" },
        { id: 2, titulo: "Reporte 2", fecha: "2024-05-06" },
        { id: 3, titulo: "Reporte 3", fecha: "2024-05-05" }
    ];

    // Datos de la empresa (suponiendo)
    const empresaData = {
        nombre: "Empresa A",
        id: "123456",
        asociacion: "Asociación ABC"
        // otros datos aquí
    };

    return (
        <>
            <Navbar useSectionMode={useSectionMode} secciones={secciones} seccionesRutas={seccionesRutas} seccionActual={seccionActual} />
            
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ mt: 2, p: 2 }}>
                            
                            <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mb: 2 }}>Información de la Empresa</Typography>
                            <Grid container alignItems="center" justifyContent="space-between" borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, mb: 1, py: 1 }}>
                            <Typography variant="h7">Nombre: {empresaData.nombre}</Typography>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="space-between" borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, mb: 1, py: 1 }}>
                            <Typography variant="h7">ID: {empresaData.id}</Typography>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="space-between" borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, mb: 1, py: 1 }}>
                            <Typography variant="h7">Asociacion: {empresaData.asociacion}</Typography>
                            </Grid>
                            {/* Agregar más campos aquí si es necesario */}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <Paper sx={{ mt: 2, p: 2 }}>
                            <Typography variant="h4" color="primary" fontWeight="bold" sx={{ mb: 2 }}>Lista de Reportes</Typography>
                            {listaReportes.map((reporte) => (
                                <Box key={reporte.id} sx={{ pl: 2, pr: 2 }}>
                                    <Grid container alignItems="center" justifyContent="space-between" borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, mb: 1, py: 1 }}>
                                        <Grid item xs={6}>
                                            <Typography variant="h5" color={"#000000"} sx={{ fontFamily: "Segoe UI" }}>{reporte.titulo}</Typography>
                                            <Typography variant="body2">Fecha: {reporte.fecha}</Typography>
                                        </Grid>
                                        <Grid item xs={6} container justifyContent="flex-end" spacing={1}>
                                            <Button variant="outlined" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1 }}>
                                                Abrir Reporte
                                            </Button>
                                            <Button variant="outlined" color="cuaternary" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1 }}>
                                                Descargar Reporte
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