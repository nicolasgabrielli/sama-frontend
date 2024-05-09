import React from "react";
import { Container, Typography, Paper, Button, Grid, Box } from "@mui/material";
import Navbar from "./Navbar";
import { Link } from 'react-router-dom';

function Usuarios() {
    const useSectionMode = true;
    const secciones = ["Home", "Empresas", "Usuarios"];
    const seccionesRutas = ["/", "/empresas", "/usuarios"];
    const seccionActual = "Usuarios";

    const listaUsuarios = ["Nicolás Gabrielli", "Jesús Medina", "Flavio Ramos", "Ignacio Riquelme"];
    const listaRoles = ["Administrador", "Editor de Reporte", "Autorizador de Reporte", "Autorizador de Registro"];

    return (
        <>
            <Navbar seccionActual={seccionActual} useSectionMode={useSectionMode} secciones={secciones} seccionesRutas={seccionesRutas} />
            <Container>
                <Paper sx={{ mt: 2, p: 2 }}>
                    <Typography variant="h4" color={"primary.main"} fontWeight={"bold"} sx={{ mb: 2 }}>Usuarios</Typography>
                    {listaUsuarios.map((usuario, index) => {
                        return (
                            <Box sx={{ pl: 2, pr: 2 }} key={index}>
                                <Grid container alignItems="center" justifyContent="space-between" borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, mb: 1, py: 1 }}>
                                    <Grid item xs={3}>
                                        <Typography variant="h5" color={"#000000"} sx={{ fontFamily: "Segoe UI" }}>
                                            {usuario}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography variant="h6" color={"#000000"} sx={{ fontFamily: "Segoe UI", fontStyle: "italic" }}>
                                            {listaRoles[index]}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} container justifyContent="flex-end" spacing={1}>
                                        <Button variant="outlined" color="error" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1 }}>
                                            Eliminar
                                        </Button>
                                        <Button variant="outlined" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1 }}>
                                            Ver Detalles
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        );
                    })}
                </Paper>
            </Container>
            <Box bgcolor="#fff" sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, boxShadow: "0px -4px 6px rgba(0, 0, 0, 0.1)" }}>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2}}>
                    <Link to="/usuarios/crear" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1, fontSize: "1.2rem" }}>
                            Agregar Usuario
                        </Button>
                    </Link>
                </Box>
            </Box>
        </>
    );
}
export default Usuarios;
