import React, { useState, useEffect } from "react";
import { Container, Typography, Paper, Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, FormGroup, FormLabel, List, ListItem, ListItemText, ListItemIcon, Divider } from "@mui/material";
import Navbar from "./Navbar";
import { Search, Check } from "@mui/icons-material";
import { Autocomplete } from "@mui/material";
import empresaService from "../services/EmpresaService";
import { Link } from "react-router-dom";

function CrearUsuario() {

    const [listaEmpresas, setListaEmpresas] = useState([]);

    const listaRoles = ["Administrador", "Autorizador de Reporte", "Autorizador de Registro", "Editor de Reporte"];

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

    const [selectedEmpresas, setSelectedEmpresas] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    // Función para manejar cambios en el campo de búsqueda
    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

    // Filtrar la lista de empresas según el término de búsqueda
    const filteredEmpresas = listaEmpresas.filter(empresa =>
        empresa.nombre.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Función para manejar la selección/deselección de todas las empresas
    const handleSelectAll = () => {
        setSelectedEmpresas(filteredEmpresas);
    };

    // Función para manejar la selección/deselección de empresas individuales
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

    // Función para manejar la selección/deselección de todas las empresas
    const isSelected = (empresa) => selectedEmpresas.some(e => e.nombre === empresa.nombre);

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
                    <Grid container spacing={2} sx={{ p: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Nombre"
                                variant="outlined"
                                helperText="Nombre completo del usuario"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Correo"
                                variant="outlined"
                                helperText="Correo electrónico del usuario"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Contraseña"
                                type="password"
                                variant="outlined"
                                helperText="Contraseña asignada al usuario"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel>Rol</InputLabel>
                                <Select
                                    label="Rol"
                                    defaultValue=""
                                    fullWidth
                                >
                                    {listaRoles.map((rol, index) => (
                                        <MenuItem key={index} value={index}>{rol}</MenuItem>
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
                                    <li {...props}>
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
