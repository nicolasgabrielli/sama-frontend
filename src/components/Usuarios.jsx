import React from "react";
import { Container, Typography, Paper, Button, Grid, Box } from "@mui/material";
import Navbar from "./Navbar";
import { Link } from 'react-router-dom';

function Usuarios() {
    const useSectionMode = true;
    const secciones = ["Home", "Empresas", "Usuarios"];
    const seccionesRutas = ["/", "/empresas", "/usuarios"];
    const seccionActual = "Usuarios";
    
    
    const listaUsuarios = ["Juanito", "Gabrielli", "Chuita"];
    return (
        <>
            <Navbar seccionActual={seccionActual} useSectionMode={useSectionMode} secciones={secciones} seccionesRutas={seccionesRutas} />
            <Container>
                <Paper sx={{ mt: 2, p: 2 }}>
                    <Typography variant="h4" color={"primary.main"} fontWeight={"bold"} sx={{ mb: 2 }}>Usuarios</Typography>
                    {listaUsuarios.map((usuario, index) => {
                        return (
                            <Box sx={{ pl: 2, pr: 2}}>
                                <Grid container alignItems="center" justifyContent="space-between" key={index} borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, mb: 1, py: 1}}>
                                    <Grid item xs={6}>
                                        <Typography variant="h5" color={"#000000"} sx={{ fontFamily: "Segoe UI" }}>
                                            {usuario}
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
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                        <Link to="/crearUsuario" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1 }}>
                            Agregar
                        </Button>
                        </Link>
                    </Box>
                </Paper>
            </Container>
        </>
        );
}
export default Usuarios;
