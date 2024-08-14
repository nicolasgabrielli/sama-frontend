import React, { useEffect, useState } from "react";
import { Avatar, AppBar, Button, Toolbar, Tooltip, Typography, Box, Collapse, Tabs, Tab, IconButton, Menu, MenuItem, ListItemIcon, Divider } from "@mui/material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from "react-router-dom";
import usuarioService from "../services/UsuarioService";

function Navbar({ useSectionMode, secciones, seccionesRutas, seccionActual }) {
    const [openCollapse, setOpenCollapse] = useState(true);
    const [tabValue, setTabValue] = useState(secciones ? secciones.indexOf(seccionActual) : 0);

    // El nombre del rol se obtiene de la lista de roles que está en usuarioService
    const [rol, setRol] = useState(localStorage.getItem('userRol') ? usuarioService.listaRoles[localStorage.getItem('userRol')] : "Usuario no autorizado");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const [usuarioLogeado, setUsuarioLogeado] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await usuarioService.getUsuarioLogueado();
                setUsuarioLogeado(response.data);
                localStorage.setItem('userName', response.data.nombre);

            } catch (error) {
                console.error('Error al obtener el usuario logueado:', error);
            }
        })();
    }, []);

    let userName = localStorage.getItem('userName') ? localStorage.getItem('userName') : "";

    const toggleCollapse = () => {
        setOpenCollapse(!openCollapse);
    };

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

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
                <Toolbar color={"primary.main"}>
                    {useSectionMode && (
                        <IconButton
                            onClick={toggleCollapse}
                            color="inherit"
                            size="large"
                            sx={{ transition: "transform 0.3s", transform: openCollapse ? "rotateX(180deg)" : "rotateX(0deg)" }}
                        >
                            <KeyboardArrowDown />
                        </IconButton>
                    )}
                    <Typography
                        variant="h4"
                        component="div"
                        sx={{
                            mr: 2
                        }}
                        fontFamily={"Copperplate Gothic"}
                        fontWeight={"bold"}
                    >
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
                <>
                    {useSectionMode ?
                        <Collapse bgcolor="#ffffff" in={openCollapse} timeout="auto" unmountOnExit>
                            <Box bgcolor="#ffffff" sx={{ borderBottom: 1, borderColor: "divider" }}>
                                <Tabs value={tabValue} onChange={handleChange}>
                                    {secciones && seccionesRutas && secciones.map((seccion, index) => (
                                        <Tab
                                            key={index}
                                            label={seccion}
                                            value={index}
                                            component={Link}
                                            to={seccionesRutas[index]}
                                            sx={{ ...tabStyle, fontWeight: tabValue === index ? "bold" : "normal" }}
                                        />
                                    ))}
                                </Tabs>
                            </Box>
                        </Collapse>
                        : null
                    }
                </>
            </AppBar>
        </React.Fragment>
    );
}

export default Navbar;
