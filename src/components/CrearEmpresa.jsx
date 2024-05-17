import React, { useState } from "react";
import { Container, Typography, Paper, Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Navbar from "./Navbar";
import empresaService from "../services/EmpresaService";
import { Link } from "react-router-dom";

function CrearEmpresa() {
    const [nombre, setNombre] = useState("");
    const [tipoSociedad, setTipoSociedad] = useState("");
    const [rut, setRut] = useState("");
    const [domicilioEmpresa, setDomicilioEmpresa] = useState("");
    const [paginaWeb, setPaginaWeb] = useState("");
    const [email, setEmail] = useState("");
    const [domicilioContacto, setDomicilioContacto] = useState("");
    const [telefono, setTelefono] = useState("");
    const [openDialog, setOpenDialog] = useState(false);

    const tiposSociedad = ["Sociedad Anónima", "Sociedad de Responsabilidad Limitada", "Empresa Individual", "Otra"];

    const handleCrearEmpresa = async (event) => {
        event.preventDefault();

        const empresaData = {
            nombre,
            tipoSociedad,
            rut,
            domicilioEmpresa,
            paginaWeb,
            email,
            domicilioContacto,
            telefono
        };

        try {
            await empresaService.crearEmpresa(empresaData);
            setOpenDialog(true);
        } catch (error) {
            console.error('Error al crear la empresa:', error);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <>
            <Navbar />
            <Container>
                <Paper sx={{ mt: 2, p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="h4" color={"primary.main"} fontWeight={"bold"} sx={{ mb: 2 }}>Crear Empresa</Typography>
                        </Grid>
                        <Grid item xs={6} container justifyContent="flex-end">
                            <Link to="/empresas" style={{ textDecoration: "none" }}>
                                <Button variant="outlined" color="primary" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1, fontSize: "1.1rem", maxHeight: 0.7 }}>
                                    Volver
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                    <form onSubmit={handleCrearEmpresa}>
                        <Grid container spacing={2} sx={{ p: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Nombre"
                                    name="nombre"
                                    variant="outlined"
                                    helperText="Nombre de la empresa"
                                    fullWidth
                                    required
                                    onChange={(event) => setNombre(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl variant="outlined" fullWidth required>
                                    <InputLabel>Tipo de Sociedad</InputLabel>
                                        <Select
                                            label="Tipo de Sociedad"
                                            name="tipoSociedad"
                                            value={tipoSociedad}
                                            onChange={(event) => setTipoSociedad(event.target.value)}
                                        >
                                            {tiposSociedad.map((tipo, index) => (
                                                <MenuItem key={index} value={tipo}>{tipo}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="RUT"
                                        name="rut"
                                        variant="outlined"
                                        helperText="RUT de la empresa"
                                        fullWidth
                                        required
                                        onChange={(event) => setRut(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Domicilio de la Empresa"
                                        name="domicilioEmpresa"
                                        variant="outlined"
                                        helperText="Domicilio de la empresa"
                                        fullWidth
                                        required
                                        onChange={(event) => setDomicilioEmpresa(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Página Web"
                                        name="paginaWeb"
                                        variant="outlined"
                                        helperText="Página web de la empresa"
                                        fullWidth
                                        onChange={(event) => setPaginaWeb(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Correo Electrónico"
                                        name="email"
                                        type="email"
                                        variant="outlined"
                                        helperText="Correo electrónico de la empresa"
                                        fullWidth
                                        required
                                        onChange={(event) => setEmail(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Domicilio de Contacto"
                                        name="domicilioContacto"
                                        variant="outlined"
                                        helperText="Domicilio de contacto de la empresa"
                                        fullWidth
                                        onChange={(event) => setDomicilioContacto(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Teléfono"
                                        name="telefono"
                                        variant="outlined"
                                        helperText="Teléfono de contacto de la empresa"
                                        fullWidth
                                        onChange={(event) => setTelefono(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} container justifyContent="flex-end">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1, fontSize: "1.1rem" }}
                                    >
                                        Crear Empresa
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                    <Dialog
                        open={openDialog}
                        onClose={handleCloseDialog}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Empresa creada"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                La empresa ha sido creada exitosamente.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} color="primary" autoFocus>
                                OK
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </>
        );
    }
    
    export default CrearEmpresa;