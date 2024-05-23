import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, Collapse, Tabs, Tab, IconButton, Button, Dialog, Grid, TextField, DialogContent, DialogActions } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link } from "react-router-dom";
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import reporteService from "../services/ReporteService";
import { useParams } from "react-router-dom";

function NavbarReporte({ useSectionMode, secciones, seccionActualIndex, onSeccionChange }) {
    const [openCollapse, setOpenCollapse] = useState(true);
    const [tabValue, setTabValue] = useState(seccionActualIndex);
    const [openDialog, setOpenDialog] = useState(false);
    const [nombreCategoria, setNombreCategoria] = useState("");
    const { idReporte } = useParams();

    useEffect(() => {
        setTabValue(seccionActualIndex);
    }, [seccionActualIndex]);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const toggleCollapse = () => {
        setOpenCollapse(!openCollapse);
    };

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
        onSeccionChange(newValue);
    };

    const handleNombreCategoriaChange = (event) => {
        setNombreCategoria(event.target.value);
    };

    const handleAgregarCategoria = () => {
        const newCategoria = {
            indexCategoria: secciones.length,
            nuevoTituloCategoria: nombreCategoria,
            indexSeccion: null,
            nuevoTituloSeccion: "",
            indexCampo: null,
            nuevoCampo: {}
        };
        secciones.push(nombreCategoria);
        reporteService.actualizarReporte(newCategoria, idReporte);
        setOpenDialog(false);
    }

    const tabStyle = {
        textTransform: "none",
        fontSize: "1.2rem",
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
                    <Typography variant="h4" component="div" sx={{ mr: 2, fontFamily: "Copperplate Gothic", fontWeight: "bold" }}>
                        SAMA
                    </Typography>
                    <Typography variant="h5" component="div" noWrap sx={{ display: { xs: "none", md: "flex" }, fontStyle: "italic" }}>
                        Administrador GRC
                    </Typography>
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
                                {secciones && secciones.map((seccion, index) => (
                                    <Tab
                                        key={index}
                                        label={seccion}
                                        value={index}
                                        component={Link}
                                        sx={{ ...tabStyle, fontWeight: tabValue === index ? "bold" : "normal" }}
                                    />
                                ))}
                            </Tabs>
                            <Button variant="contained" onClick={() => handleOpenDialog()} sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "normal", fontSize: "1rem", m: 0.5 }}>
                                Agregar Categoría <AddCircleOutlinedIcon sx={{ ml: 0.5, mr: -0.5 }} />
                            </Button>
                            <Link to={-1}>
                                <Button variant="contained" sx={{ textTransform: "none", fontSize: "1rem", fontStyle: "italic", fontWeight: "bold", mr: 1 }}>
                                    Volver
                                </Button>
                            </Link>
                        </Box>
                    </Collapse>
                )}
            </AppBar>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 1 }}>Agregar Categoría</Typography>
                        </Grid>
                        <Grid item xs={4} container justifyContent="flex-end" sx={{ mb: 2 }}>
                            <IconButton onClick={() => setOpenDialog(false)} disableRipple><CloseIcon /></IconButton>
                        </Grid>
                        <Grid item xs={12} container>
                            <Typography variant="h7">Introduzca el nombre de la categoría:</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Nombre de la Categoría"
                                variant="outlined"
                                fullWidth
                                value={nombreCategoria}
                                onChange={handleNombreCategoriaChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid container>
                        <Grid item xs={12} container justifyContent="flex-end">
                            <Button color="secondary" variant="text" onClick={() => setOpenDialog(false)}>
                                Cancelar
                            </Button>
                            <Button color="primary" variant="text" onClick={handleAgregarCategoria}>
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
