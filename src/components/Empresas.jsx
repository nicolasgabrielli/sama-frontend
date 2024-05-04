import React from "react";
import { Container, Typography, Paper, Button, Grid, Box } from "@mui/material";
import Navbar from "./Navbar";

function Empresas() {
    const useSectionMode = true;
    const secciones = ["Home", "Empresas", "Usuarios"];
    const seccionesRutas = ["/", "/empresas", "/usuarios"];
    const seccionActual = "Empresas";

    const listaEmpresas = ["Empresa A", "Empresa B", "Empresa C", "Empresa D", "Empresa E", "Empresa F", "Empresa G", "Empresa H", "Empresa I", "Empresa J"];
    return (
        <>
            <Navbar seccionActual={seccionActual} useSectionMode={useSectionMode} secciones={secciones} seccionesRutas={seccionesRutas} />
            <Container>
                <Paper sx={{ mt: 2, p: 2 }}>
                    <Typography variant="h4" color={"primary.main"} fontWeight={"bold"} sx={{ mb: 2 }}>Empresas</Typography>
                    {listaEmpresas.map((empresa, index) => {
                        return (
                            <Box sx={{ pl: 2, pr: 2}}>
                                <Grid container alignItems="center" justifyContent="space-between" key={index} borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, mb: 1, py: 1}}>
                                    <Grid item xs={6}>
                                        <Typography variant="h5" color={"#000000"} sx={{ fontFamily: "Segoe UI" }}>
                                            {empresa}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} container justifyContent="flex-end" spacing={1}>
                                        <Button variant="outlined" color="error" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1 }}>
                                            Eliminar
                                        </Button>
                                        <Button variant="outlined" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1 }}>
                                            Ver Detalles
                                        </Button>
                                        <Button variant="outlined" color="cuaternary" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic"}}>
                                            Ver Reportes
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        );
                    })}
                </Paper>
            </Container>
        </>
    );
}

export default Empresas;
