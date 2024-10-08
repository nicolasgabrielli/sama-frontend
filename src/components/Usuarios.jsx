import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Paper,
    Button,
    Grid,
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { Link } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import Navbar from "./Navbar";
import usuarioService from "../services/UsuarioService";

function Usuarios() {
    // Datos de la barra de navegación
    const useSectionMode = true;
    const secciones = ["Empresas", "Usuarios"];
    const seccionesRutas = ["/empresas", "/usuarios"];
    const seccionActual = "Usuarios";
    const [usuarioLogueado, setUsuarioLogueado] = useState(null);

    // Listas de usuarios y roles
    const [listaUsuarios, setListaUsuarios] = useState([]);

    // Estado para el estado de carga
    const [loading, setLoading] = useState(true);

    // Obtener la lista de usuarios al cargar el componente
    useEffect(() => {
        setLoading(true);
        (async () => {
            await fetchData();
            await usuarioService.getUsuarioLogueado().then((response) => {
                setUsuarioLogueado(response.data);
            });
            setLoading(false);
        })();
    }, []);

    // Función para obtener la lista de usuarios
    const fetchData = async () => {
        try {
            const response = await usuarioService.getListaUsuarios();
            setListaUsuarios(response.data);
        } catch (error) {
            console.error('Error al obtener la lista de usuarios:', error);
        }
    };

    // Estado para el valor del campo de búsqueda
    const [searchValue, setSearchValue] = useState("");

    // Estado para controlar la apertura y cierre del diálogo
    const [openDialog, setOpenDialog] = useState(false);

    // Estado para almacenar el nombre del usuario a eliminar
    const [usuarioAEliminar, setUsuarioAEliminar] = useState("");

    // Estado para almacenar el nombre ingresado por el usuario
    const [nombreIngresado, setNombreIngresado] = useState("");

    // Función para manejar cambios en el campo de búsqueda
    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

    // Función para limpiar el campo de búsqueda
    const handleClearSearch = () => {
        setSearchValue("");
    };

    // Función para abrir el diálogo de eliminación
    const handleOpenDialog = (usuario) => {
        setUsuarioAEliminar(usuario);
        setNombreIngresado(""); // Limpiar el nombre ingresado cada vez que se abre el diálogo
        setOpenDialog(true);
    };

    // Función para cerrar el diálogo de eliminación
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // Función para manejar cambios en el nombre ingresado por el usuario
    const handleNombreIngresadoChange = (event) => {
        setNombreIngresado(event.target.value);
    };

    // Función para manejar la eliminación del usuario
    const handleEliminarUsuario = () => {
        if (nombreIngresado.toLowerCase() === usuarioAEliminar.nombre.toLowerCase()) {
            const id = usuarioAEliminar.id;
            usuarioService.deleteUsuario(usuarioAEliminar.id);
            setOpenDialog(false);
            setListaUsuarios(listaUsuarios.filter(usuario => usuario.id !== id));
        } else {
            alert("El nombre ingresado no coincide con el usuario a eliminar.");
        }
    };

    // Filtrar la lista de usuarios según el término de búsqueda
    const listaUsuariosFiltrada = listaUsuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(searchValue.toLowerCase())
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
                    <Container sx={{ pb: '100px' }}>
                        <Paper sx={{ mt: 2, p: 2 }}>
                            <Typography variant="h4" color={"primary.main"} fontWeight={"bold"} sx={{ mb: 2 }}>Usuarios</Typography>
                            {/* Campo de búsqueda */}
                            <TextField
                                label="Buscar Usuario"
                                variant="outlined"
                                value={searchValue}
                                onChange={handleSearchChange}
                                fullWidth
                                InputProps={{       /* Botón para limpiar la búsqueda */
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {searchValue && (
                                                <IconButton onClick={handleClearSearch} edge="end">
                                                    <ClearIcon />
                                                </IconButton>
                                            )}
                                        </InputAdornment>
                                    )
                                }}
                                sx={{ mb: 2 }}
                            />

                            {/* Lista de usuarios filtrada (Usando el filtro de búsqueda) */}
                            {listaUsuariosFiltrada.map((usuario, index) => {
                                return (
                                    <Box sx={{ pl: 2, pr: 2 }} key={index}>
                                        <Grid container alignItems="center" justifyContent="space-between" borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, mb: 1, py: 1 }}>
                                            <Grid item xs={3}>
                                                <Typography variant="h5" color={"#000000"} sx={{ fontFamily: "Segoe UI" }}>
                                                    {usuario.nombre}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography variant="h6" color={"#000000"} sx={{ fontFamily: "Segoe UI", fontStyle: "italic" }}>
                                                    {usuarioService.listaRoles[usuario.rol]}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} container justifyContent="flex-end" spacing={1}>
                                                {usuarioLogueado && usuarioLogueado.rol === "0" && usuarioLogueado.id !== usuario.id && (
                                                    <Button variant="outlined" color="error" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1 }} onClick={() => handleOpenDialog(usuario)}>
                                                        Eliminar
                                                    </Button>    
                                                )}
                                                <Button variant="outlined"
                                                    sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1 }}
                                                    component={Link}
                                                    to={`/usuarios/${usuario.id}`}>
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
                            <Link to="/usuarios/crear" style={{ textDecoration: 'none' }}>
                                <Button variant="contained" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1, fontSize: "1.2rem" }}>
                                    Agregar Usuario
                                </Button>
                            </Link>
                        </Box>
                    </Box>

                    {/* Diálogo de eliminación */}
                    <Dialog open={openDialog} onClose={handleCloseDialog}>
                        <DialogTitle>Eliminar Usuario</DialogTitle>
                        <DialogContent>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                Usted está a punto de eliminar el usuario "<Typography component="span" variant="body1" color="primary.main" sx={{ fontStyle: "italic" }}>{usuarioAEliminar.nombre}</Typography>", para confirmar la <strong><Typography component="span" variant="body1" color="error.main">eliminación</Typography></strong> ingrese nuevamente el nombre de usuario en el cuadro de texto:
                            </Typography>

                            <TextField
                                autoFocus
                                margin="dense"
                                label="Nombre de Usuario a Eliminar"
                                type="text"
                                fullWidth
                                value={nombreIngresado}
                                onChange={handleNombreIngresadoChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} color="primary" variant="outlined">
                                Cancelar
                            </Button>
                            <Button onClick={handleEliminarUsuario} color="error" variant="contained">
                                <DeleteIcon sx={{ ml: -0.5, mr: 0.5 }} /> Eliminar
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </>
    );
}
export default Usuarios;