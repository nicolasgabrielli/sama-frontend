import React from "react";
import { Container, Typography, Paper, Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, FormGroup, FormLabel } from "@mui/material";
import Navbar from "./Navbar";

function CrearUsuario() {
    const useSectionMode = true;
    const secciones = ["Home", "Empresas", "Usuarios"];
    const seccionesRutas = ["/", "/empresas", "/usuarios"];
    const seccionActual = "Usuarios";

     const listaEmpresas = ["Empresa A", "Empresa B", "Empresa C", "Empresa D", "Empresa E", "Empresa F", "Empresa G", "Empresa H", "Empresa I", "Empresa J"];

     return (
        <>
            <Navbar seccionActual={seccionActual} useSectionMode={useSectionMode} secciones={secciones} seccionesRutas={seccionesRutas} />
            <Container>
                <Paper sx={{ mt: 2, p: 2 }}>
                    <Typography variant="h4" color={"primary.main"} fontWeight={"bold"} sx={{ mb: 2 }}>Crear Usuario</Typography>
                    <Grid container spacing={2} sx={{ p: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Nombre"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Correo"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Contraseña"
                                type="password"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel>Rol</InputLabel>
                                <Select
                                    label="Rol"
                                    defaultValue=""
                                >
                                    <MenuItem value={"Administrador"}>Autorizador de reporte</MenuItem>
                                    <MenuItem value={"Usuario Regular"}>Autorizador de registro</MenuItem>
                                    <MenuItem value={"Usuario Regular"}>Visualizador de evidencia</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}  sx={{ p: 1 }}>
                            <Typography variant="h6" color={"primary.main"} fontWeight={"bold"} sx={{ mb: 2 }}>Acceso a empresas:</Typography>
                            {listaEmpresas.map((empresa, index) => (
                                <Grid item xs={12} key={index}>
                                    <FormControlLabel
                                        control={<Checkbox />}
                                        label={empresa}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <Grid item xs={12} container justifyContent="flex-end">
                            <Button variant="contained" color="primary" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1, fontSize: "1.1rem" }}>
                                Crear Usuario
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </>
    );
}

export default CrearUsuario;