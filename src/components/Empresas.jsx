import React, { useState, useEffect } from "react";
import { Container, Typography, Paper, Button, Grid, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import Navbar from "./Navbar";
import empresaService from "../services/EmpresaService";
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from "react-router-dom";

function Empresas() {
    const useSectionMode = true;
    const secciones = ["Empresas", "Usuarios"];
    const seccionesRutas = ["/empresas", "/usuarios"];
    const seccionActual = "Empresas";

    const [listaEmpresas, setListaEmpresas] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [empresaAEliminar, setEmpresaAEliminar] = useState(null);
    const [loading, setLoading] = useState(true);

    // Estado para almacenar el nombre ingresado para confirmar la eliminación
    const [nombreIngresado, setNombreIngresado] = useState("");
    
    // Cargar la lista de empresas al cargar el componente
    useEffect(() => {
        setLoading(true);
        (async () => {
            await fetchData();
            setLoading(false);
        })();
    }, []);
    
    // Función para obtener la lista de empresas
    const fetchData = async () => {
        try {
            const response = await empresaService.getListaEmpresas();
            setListaEmpresas(response.data);
        } catch (error) {
            console.error('Error al obtener la lista de empresas:', error);
        }
    };
    
    // Función para manejar cambios en el campo de búsqueda
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Función para manejar la apertura del diálogo de confirmación de eliminación
    const handleOpenDialog = (empresa) => {
        setEmpresaAEliminar(empresa);
        setOpenDialog(true);
    };

    // Función para manejar la confirmación de eliminación de la empresa
    const handleConfirmarEliminacion = () => {
        if (nombreIngresado !== empresaAEliminar.nombre) {
            return;
        }
        empresaService.eliminarEmpresa(empresaAEliminar.id);
        setListaEmpresas(listaEmpresas.filter(empresa => empresa.id !== empresaAEliminar.id));
        setEmpresaAEliminar(null);
        setNombreIngresado("");
        setOpenDialog(false);
    };

    // Función para cerrar el diálogo de confirmación de eliminación
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // Función para manejar cambios en el nombre ingresado por el usuario
    const handleNombreIngresadoChange = (event) => {
        setNombreIngresado(event.target.value);
    };

    // Filtrar la lista de empresas según el término de búsqueda
    const filteredEmpresas = listaEmpresas.filter(empresa =>
        empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Navbar seccionActual={seccionActual} useSectionMode={useSectionMode} secciones={secciones} seccionesRutas={seccionesRutas} />
            {loading && (
                <>
                    <Box
                        sx={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            bgcolor: 'background.default',
                          }}
                    >
                        <CircularProgress size={80} />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Cargando...
                        </Typography>
                    </Box>
                </>
            )}
            {!loading && (
                <>
                    <Container sx={{ pb: '100px' }}> {/* Asegúrate de ajustar este valor según la altura del box fijo */}
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
                                    <Box sx={{ pl: 2, pr: 2 }} key={index}>
                                        <Grid container alignItems="center" justifyContent="space-between" key={index} borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, mb: 1, py: 1 }}>
                                            <Grid item xs={6}>
                                                <Typography variant="h5" color={"#000000"} sx={{ fontFamily: "Segoe UI" }}>
                                                    {empresa.nombre}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} container justifyContent="flex-end" spacing={1}>
                                                <Button variant="outlined" color="error" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1 }} onClick={() => handleOpenDialog(empresa)}>
                                                    Eliminar
                                                </Button>
                                                <Button variant="outlined" color="primary" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic" }}
                                                    component={Link}
                                                    to={`/empresas/${empresa.id}/reportes`}>
                                                    Ver Detalles
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                );
                            })}
                        </Paper>
                    </Container>
                    <Box bgcolor="#fff" sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, boxShadow: "0px -4px 6px rgba(0, 0, 0, 0.1)", height: '80px' }}>
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
                            <Link to="/empresas/crear" style={{ textDecoration: "none" }}>
                                <Button variant="contained" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1, fontSize: "1.2rem" }}>
                                    Agregar Empresa
                                </Button>
                            </Link>
                        </Box>
                    </Box>

                    {/* Diálogo de confirmación de eliminación */}
                    <Dialog open={openDialog} onClose={handleCloseDialog}>
                        <DialogTitle>Eliminar Empresa</DialogTitle>
                        <DialogContent>
                            <Typography variant="body1">
                                Usted está a punto de eliminar la empresa "<Typography component="span" variant="body1" color="primary.main" sx={{ fontStyle: "italic" }}>{empresaAEliminar && empresaAEliminar.nombre}</Typography>". Para confirmar la <Typography component="span" variant="body1" color="red" sx={{ fontWeight: "bold" }}>eliminación</Typography>, escriba el nombre de la empresa:
                            </Typography>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Nombre de la Empresa a Eliminar"
                                type="text"
                                value={nombreIngresado}
                                onChange={handleNombreIngresadoChange}
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} color="primary" variant="outlined">
                                Cancelar
                            </Button>
                            <Button onClick={handleConfirmarEliminacion} color="error" variant="outlined">
                                Eliminar <DeleteIcon sx={{ ml: 0.5, mr: -0.5 }} />
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </>
    );
}

export default Empresas;
