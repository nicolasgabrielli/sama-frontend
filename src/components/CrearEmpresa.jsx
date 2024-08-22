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
    const [razonSocial, setRazonSocial] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [errors, setErrors] = useState({});

    const tiposSociedad = ["Sociedad Anónima", "Sociedad de Responsabilidad Limitada", "Empresa Individual", "Otra"];

    const validateRut = (rut) => {
        const rutPattern = /^[0-9]+-[0-9Kk]$/;
        return rutPattern.test(rut);
    };

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    };

    const validateTelefono = (telefono) => {
        const telefonoPattern = /^\+?[0-9]{9,12}$/;
        return telefonoPattern.test(telefono);
    };

    const handleCrearEmpresa = async (event) => {
        event.preventDefault();

        let validationErrors = {};

        if (!validateRut(rut)) {
            validationErrors.rut = "RUT inválido. Debe estar en formato 12345678-9.";
        }

        if (!validateEmail(email)) {
            validationErrors.email = "Correo electrónico inválido.";
        }

        if (!validateTelefono(telefono) && telefono !== "") {
            validationErrors.telefono = "Teléfono inválido. Debe contener entre 9 y 12 dígitos.";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const empresaData = {
            nombre,
            tipoSociedad,
            rut,
            domicilioEmpresa,
            paginaWeb,
            email,
            domicilioContacto,
            telefono,
            razonSocial
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
                                    label="Nombre de Fantasía de la Empresa"
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
                                    helperText={errors.rut ? errors.rut : "RUT de la empresa"}
                                    error={!!errors.rut}
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
                                    label="Razón Social"
                                    name="razonSocial"
                                    variant="outlined"
                                    helperText="Razón Social de la empresa"
                                    fullWidth
                                    required
                                    onChange={(event) => setRazonSocial(event.target.value)}
                                />
                            </Grid>
                            
                            <Grid item xs={12}>
                                <TextField
                                    label="Correo Electrónico"
                                    name="email"
                                    type="email"
                                    variant="outlined"
                                    helperText={errors.email ? errors.email : "Correo electrónico de la empresa"}
                                    error={!!errors.email}
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
                                    helperText={errors.telefono ? errors.telefono : "Teléfono de contacto de la empresa"}
                                    error={!!errors.telefono}
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
                        <Link to="/empresas" style={{ textDecoration: "none" }}>
                            <Button onClick={handleCloseDialog} color="primary" autoFocus>
                                OK
                            </Button>
                        </Link>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
}

export default CrearEmpresa;
