import React, { useState, useEffect } from "react";
import { Container, Typography, Paper, Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItemText } from "@mui/material";
import Navbar from "./Navbar";
import { Search, Check } from "@mui/icons-material";
import { Autocomplete } from "@mui/material";
import empresaService from "../services/EmpresaService";
import { Link } from "react-router-dom";
import usuarioService from "../services/UsuarioService";
import { clear } from "@testing-library/user-event/dist/clear";

function CrearUsuario() {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const [rol, setRol] = useState("");
    const [listaEmpresas, setListaEmpresas] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        empresaService.getListaEmpresas()
            .then(response => response.data)
            .then(data => setListaEmpresas(data))
            .catch(error => console.error('Error al obtener la lista de empresas:', error));
    }, []);

    const [selectedEmpresas, setSelectedEmpresas] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

    const filteredEmpresas = listaEmpresas.filter(empresa =>
        empresa.nombre.toLowerCase().includes(searchValue.toLowerCase())
    );

    const handleSelectAll = () => {
        setSelectedEmpresas(filteredEmpresas);
    };

    const handleEmpresaToggle = (empresa) => {
        const selectedIndex = selectedEmpresas.findIndex(e => e.nombre === empresa.nombre);
        let newSelectedEmpresas = [];

        if (selectedIndex === -1) {
            newSelectedEmpresas = [...selectedEmpresas, empresa];
        } else if (selectedIndex === 0) {
            newSelectedEmpresas = selectedEmpresas.slice(1);
        } else if (selectedIndex === selectedEmpresas.length - 1) {
            newSelectedEmpresas = selectedEmpresas.slice(0, -1);
        } else if (selectedIndex > 0) {
            newSelectedEmpresas = [
                ...selectedEmpresas.slice(0, selectedIndex),
                ...selectedEmpresas.slice(selectedIndex + 1)
            ];
        }

        setSelectedEmpresas(newSelectedEmpresas.sort((a, b) => a.nombre.localeCompare(b.nombre)));
    };

    const isSelected = (empresa) => selectedEmpresas.some(e => e.nombre === empresa.nombre);

    const handleCrearUsuario = async (event) => {
        event.preventDefault();

        const userData = {
            nombre: nombre,
            correo: correo,
            contrasenia: contrasenia,
            rol: rol,
            empresas: selectedEmpresas.map(empresa => empresa.id)
        };

        try {
            await usuarioService.crearUsuario(userData);
            clearForm();
            setOpenDialog(true);
        } catch (error) {
            console.error('Error al crear el usuario:', error);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const clearForm = () => {
        setNombre('');
        setCorreo('');
        setContrasenia('');
        setRol('');
        setSelectedEmpresas([]);
    };

    return (
        <>
            <Navbar />
            <Container>
                <Paper sx={{ mt: 2, p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="h4" color={"primary.main"} fontWeight={"bold"} sx={{ mb: 2 }}>Crear Usuario</Typography>
                        </Grid>
                        <Grid item xs={6} container justifyContent="flex-end">
                            <Link to="/usuarios" style={{ textDecoration: "none" }}>
                                <Button variant="outlined" color="primary" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1, fontSize: "1.1rem", maxHeight: 0.7 }}>
                                    Volver
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                    <form onSubmit={handleCrearUsuario}>
                        <Grid container spacing={2} sx={{ p: 1 }}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Nombre"
                                    name="nombre"
                                    variant="outlined"
                                    helperText="Nombre completo del usuario"
                                    fullWidth
                                    required
                                    onChange={(event) => setNombre(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Correo"
                                    name="correo"
                                    type="email"
                                    variant="outlined"
                                    helperText="Correo electrónico del usuario"
                                    fullWidth
                                    required
                                    onChange={(event) => setCorreo(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Contraseña"
                                    name="contrasenia"
                                    type="password"
                                    variant="outlined"
                                    helperText="Contraseña asignada al usuario"
                                    fullWidth
                                    required
                                    onChange={(event) => setContrasenia(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl variant="outlined" fullWidth required>
                                    <InputLabel>Rol</InputLabel>
                                    <Select
                                        label="Rol"
                                        name="rol"
                                        value={rol}
                                        onChange={(event) => setRol(event.target.value)}
                                    >
                                        {usuarioService.listaRoles.map((rol, index) => (
                                            <MenuItem key={index} value={rol}>{rol}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sx={{ p: 1 }}>
                                <Typography variant="h6" color={"primary.main"} fontWeight={"bold"} sx={{ mb: 2 }}>Acceso a empresas:</Typography>
                                <Autocomplete
                                    disablePortal
                                    fullWidth
                                    multiple
                                    options={filteredEmpresas}
                                    getOptionLabel={(empresa) => empresa.nombre}
                                    value={selectedEmpresas}
                                    onChange={(event, newValue) => {
                                        setSelectedEmpresas(newValue.sort((a, b) => a.nombre.localeCompare(b.nombre)));
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Empresas"
                                            variant="outlined"

                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <>
                                                        <Search />
                                                        {params.InputProps.startAdornment}
                                                    </>
                                                ),
                                                endAdornment: (
                                                    <>
                                                        <Button
                                                            onClick={handleSelectAll}
                                                            color="primary"
                                                            startIcon={<Check />}
                                                        >
                                                            Seleccionar Todo
                                                        </Button>
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                )
                                            }}
                                            onChange={handleSearchChange}
                                        />
                                    )}
                                    renderOption={(props, option, { selected }) => (
                                        <li key={option.nombre} {...props}>
                                            <Checkbox
                                                icon={<span className="MuiBox-root" />}
                                                checkedIcon={<span className="MuiBox-root" />}
                                                checked={isSelected(option)}
                                                onClick={() => handleEmpresaToggle(option)}
                                            />
                                            <ListItemText primary={option.nombre} />
                                        </li>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} container justifyContent="flex-end">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1, fontSize: "1.1rem" }}
                                >
                                    Crear Usuario
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
                    <DialogTitle id="alert-dialog-title">{"Usuario creado"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            El usuario ha sido creado exitosamente.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Link to="/usuarios" style={{ textDecoration: "none" }}>
                            <Button onClick={() => handleCloseDialog()} color="primary" autoFocus>
                                OK
                            </Button>
                        </Link>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
}

export default CrearUsuario;
