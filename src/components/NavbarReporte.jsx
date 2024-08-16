import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppBar, Box, Button, Collapse, Dialog, DialogActions, DialogContent, Divider, Grid, IconButton, ListItemIcon, Tab, Tabs, TextField, Toolbar, Typography, Avatar, Tooltip, Menu, MenuItem } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import reporteService from "../services/ReporteService";
import usuarioService from "../services/UsuarioService";


function NavbarReporte({ useSectionMode, categorias, categoriaActualIndex, onCategoriaChange, tituloReporte, anioReporte, refreshReporte, usuarioLogeado, rolesEditarReporte }) {
    const [openCollapse, setOpenCollapse] = useState(true);
    const [tabValue, setTabValue] = useState(categoriaActualIndex);
    const [openDialog, setOpenDialog] = useState(false);
    const [tituloCategoria, setTituloCategoria] = useState("");
    const { idReporte } = useParams();
    const userName = localStorage.getItem('userName') ? localStorage.getItem('userName') : "";
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const rol = localStorage.getItem('userRol') ? usuarioService.listaRoles[localStorage.getItem('userRol')] : "Usuario no autorizado";
    
    useEffect(() => {
        setTabValue(categoriaActualIndex);
        refreshReporte();
    }, [categoriaActualIndex]);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const toggleCollapse = () => {
        setOpenCollapse(!openCollapse);
    };

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
        onCategoriaChange(newValue);
    };

    const handleTituloCategoriaChange = (event) => {
        setTituloCategoria(event.target.value);
    };

    const handleAgregarCategoria = async () => {
        const newCategoria = {
            coordenadas: {
                indexCategoria: categorias.length
            },
            nuevoTituloCategoria: tituloCategoria,
        };
        await reporteService.actualizarReporte(newCategoria, idReporte);
        categorias.push(tituloCategoria);
        refreshReporte();
        setOpenDialog(false);
    }

    const tabStyle = {
        textTransform: "none",
        fontSize: "1.2rem",
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <React.Fragment>
            <AppBar position="sticky">
                <Toolbar color="primary">
                    {useSectionMode && (
                        <IconButton
                            onClick={toggleCollapse}
                            color="inherit"
                            size="large"
                            sx={{ transition: "transform 0.3s", transform: openCollapse ? "rotateX(180deg)" : "rotateX(0deg)" }}
                        >
                            <KeyboardArrowDownIcon />
                        </IconButton>
                    )}
                    <Typography variant="h4" component="div" sx={{ mr: 2, ml: 2, fontFamily: "Copperplate Gothic", fontWeight: "bold" }}>
                        SAMA
                    </Typography>
                    <Typography
                        variant="h5"
                        component="div"
                        noWrap
                        sx={{
                            display: {
                                xs: "none",
                                md: "flex"
                            },
                            fontStyle: "italic",
                            pr: 1
                        }}
                    >
                        {rol}
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", ml: 38 }}>
                        <Typography variant="h5" component="div" noWrap sx={{ display: { xs: "none", md: "flex" }, fontStyle: "italic", p: 1 }}>
                            {tituloReporte} - {anioReporte}
                        </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    {usuarioLogeado ? (
                        <>
                            <Typography
                                variant="h5"
                                component="div"
                                noWrap
                                sx={{
                                    display: {
                                        xs: "none",
                                        md: "flex"
                                    },
                                    fontStyle: "italic",
                                    pr: 1,
                                    mr: 1,
                                }}
                            >
                                    {usuarioLogeado ? userName : ""}
                            </Typography>
                            {/* Botón al final de la Navbar */}
                            <Tooltip title={"Configuración"} placement="bottom" arrow>
                                <IconButton
                                    onClick={handleClick}
                                    size="small"
                                    sx={{ ml: 2 }}
                                    aria-controls={open ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                >
                                    <Avatar sx={{ width: 32, height: 32 }}>
                                        {usuarioLogeado.nombre ? usuarioLogeado.nombre.charAt(0) : "U"}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                        </>
                    ) : <></>}
                    <Menu
                        id="account-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem component={Link} to={`/usuarios/${usuarioLogeado?.id}`} onClick={handleClose}>
                            <ListItemIcon>
                                <AccountCircleIcon fontSize="small" />
                            </ListItemIcon>
                            Mi cuenta
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            Cerrar Sesión
                        </MenuItem>
                    </Menu>
                </Toolbar>
                {useSectionMode && (
                    <Collapse in={openCollapse} timeout="auto" unmountOnExit>
                        <Box sx={{ bgcolor: "white", borderBottom: 1, borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", height: "100%" }}>
                            <Tabs
                                value={tabValue}
                                onChange={handleChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{
                                    flexGrow: 1,
                                    "& .MuiTabs-scrollButtons": {
                                        color: "black",
                                    },
                                }}
                            >
                                {categorias && categorias.map((seccion, index) => (
                                    <Tab
                                        key={index}
                                        label={seccion}
                                        value={index}
                                        component={Link}
                                        sx={{ ...tabStyle, fontWeight: tabValue === index ? "bold" : "normal" }}
                                    />
                                ))}
                            </Tabs>
                            {usuarioLogeado && rolesEditarReporte && rolesEditarReporte.includes(parseInt(usuarioLogeado.rol)) && (
                                <Button
                                    variant="contained"
                                    onClick={() => handleOpenDialog()}
                                    sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1rem", m: 0.5, width: "250px" }}
                                    startIcon={<AddCircleIcon />}
                                >
                                    Agregar Categoría
                                </Button>
                            )}
                            <Link to={-1}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        textTransform: "none",
                                        fontSize: "1rem",
                                        fontStyle: "italic",
                                        fontWeight: "bold",
                                        mr: 1,
                                    }}
                                    startIcon={<ArrowBackIcon />}
                                >

                                    Volver
                                </Button>
                            </Link>
                        </Box>
                    </Collapse>
                )}
            </AppBar>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 1 }}>Agregar Categoría</Typography>
                        </Grid>
                        <Grid item xs={4} container justifyContent="flex-end" sx={{ mb: 2 }}>
                            <IconButton onClick={() => setOpenDialog(false)} disableRipple><CloseIcon /></IconButton>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" sx={{ px: 2, mb: 2, mt: -1 }}>
                                Introduzca el título de la categoría:
                            </Typography>
                            <Box sx={{ px: 2 }}>
                                <TextField
                                    label="Título de la Categoría"
                                    variant="outlined"
                                    fullWidth
                                    value={tituloCategoria}
                                    onChange={(event) => handleTituloCategoriaChange(event)}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid container>
                        <Grid item xs={12} container justifyContent="flex-end">
                            <Button color="secondary" variant="text" onClick={() => setOpenDialog(false)}>
                                Cancelar
                            </Button>
                            <Button color="cuaternary" variant="text" onClick={() => handleAgregarCategoria()}>
                                Agregar
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default NavbarReporte;
