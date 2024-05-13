import React, { useState, useEffect } from "react";
import { Container, Typography, Paper, Button, Grid, Box, TextField } from "@mui/material";
import Navbar from "./Navbar";
import empresaService from "../services/EmpresaService";

function Empresas() {
    const useSectionMode = true;
    const secciones = ["Home", "Empresas", "Usuarios"];
    const seccionesRutas = ["/", "/empresas", "/usuarios"];
    const seccionActual = "Empresas";

    const [listaEmpresas, setListaEmpresas] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchEmpresas = async () => {
            try {
                const response = await empresaService.getListaEmpresas();
                if (response && response.data) {
                    setListaEmpresas(response.data);
                }
            } catch (error) {
                console.error('Error al obtener la lista de empresas:', error);
            }
        };

        fetchEmpresas();
    }, []);

    // Función para manejar cambios en el campo de búsqueda
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filtrar la lista de empresas según el término de búsqueda
    const filteredEmpresas = listaEmpresas.filter(empresa =>
        empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Navbar seccionActual={seccionActual} useSectionMode={useSectionMode} secciones={secciones} seccionesRutas={seccionesRutas} />
            <Container>
                <Paper sx={{ mt: 2, p: 2 }}>
                    <Typography variant="h4" color={"primary.main"} fontWeight={"bold"} sx={{ mb: 2 }}>Empresas</Typography>
                    <TextField
                        label="Buscar Empresa"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ mb: 2 }}
                    />
                    {filteredEmpresas.map((empresa, index) => {
                        return (
                            <Box sx={{ pl: 2, pr: 2 }}>
                                <Grid container alignItems="center" justifyContent="space-between" key={index} borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, mb: 1, py: 1 }}>
                                    <Grid item xs={6}>
                                        <Typography variant="h5" color={"#000000"} sx={{ fontFamily: "Segoe UI" }}>
                                            {empresa.nombre}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} container justifyContent="flex-end" spacing={1}>
                                        <Button variant="outlined" color="error" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1 }}>
                                            Eliminar
                                        </Button>
                                        <Button variant="outlined" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1 }}>
                                            Ver Detalles
                                        </Button>
                                        <Button variant="outlined" color="cuaternary" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic" }}>
                                            Ver Reportes
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        );
                    })}
                </Paper>
            </Container>
            <Box bgcolor="#fff" sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, boxShadow: "0px -4px 6px rgba(0, 0, 0, 0.1)" }}>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
                    <Button variant="contained" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1, fontSize: "1.2rem" }}>
                        Agregar Empresa
                    </Button>
                </Box>
            </Box>
        </>
    );
}

export default Empresas;
