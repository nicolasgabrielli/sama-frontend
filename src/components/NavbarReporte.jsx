import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { AppBar, Box, Button, Collapse, Dialog, DialogActions, DialogContent, Grid, IconButton, Tab, Tabs, TextField, Toolbar, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import reporteService from "../services/ReporteService";

function NavbarReporte({ useSectionMode, categorias, categoriaActualIndex, onCategoriaChange, tituloReporte, refreshReporte }) {
    const [openCollapse, setOpenCollapse] = useState(true);
    const [tabValue, setTabValue] = useState(categoriaActualIndex);
    const [openDialog, setOpenDialog] = useState(false);
    const [tituloCategoria, setTituloCategoria] = useState("");
    const { idReporte } = useParams();

    useEffect(() => {
        setTabValue(categoriaActualIndex);
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
                    <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
                        <Typography variant="h5" component="div" noWrap sx={{ display: { xs: "none", md: "flex" }, fontStyle: "italic" }}>
                            {tituloReporte}
                        </Typography>
                    </Box>
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
                            <Typography variant="h7">Introduzca el título de la categoría:</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Título de la Categoría"
                                variant="outlined"
                                fullWidth
                                value={tituloCategoria}
                                onChange={handleTituloCategoriaChange}
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
