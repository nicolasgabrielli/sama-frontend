import { Grid, Box, Button, Dialog, DialogContent, DialogActions, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import React from "react";

function NavbarEvidencia() {
    const { idReporte } = useParams();
    const [openDialog, setOpenDialog] = React.useState(false);
    const [evidencias, setEvidencias] = React.useState([{ nombre: "Evidencia 1", tipo: "Archivo" }, { nombre: "Evidencia 2", tipo: "Página" }, { nombre: "Evidencia 3", tipo: "Archivo"}]);
    return (
        <React.Fragment>
            <Box bgcolor="#fff" sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, boxShadow: "0px -4px 6px rgba(0, 0, 0, 0.1)", height: '80px' }}>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: '100%' }}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item>
                            <Button variant="outlined" color="primary" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1 }} onClick={() => setOpenDialog(true)}>
                                Gestionar Evidencias
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" color="cuaternary" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic" }}
                                component={Link}
                            >
                                Descargar Reporte
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                {/* Contenido del diálogo */}
                <DialogContent>
                    <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 1 }}>Gestionar Evidencias</Typography>
                    </Grid>
                    <Grid item xs={4} container justifyContent="flex-end" sx={{ mb: 2 }}>
                        <IconButton onClick={() => setOpenDialog(false)} disableRipple><CloseIcon /></IconButton>
                    </Grid>
                    </Grid>
                    {evidencias.length >= 1 && evidencias.map((evidencia, index) => (
                        <>
                            <Box sx={{ pl: 2, pr: 2, mb: 2 }} key={index}>
                                <Grid container alignItems="center" justifyContent="space-between" borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, py: 1 }}>
                                    <Grid item xs={3}>
                                        <Typography
                                            variant="h5"
                                            color="#000000"
                                            sx={{ fontFamily: "Segoe UI", fontWeight: "bold" }}
                                        >
                                            {evidencia.nombre}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3} container>
                                        <Typography variant="h5" color={"#000000"} sx={{
                                            fontFamily: "Segoe UI",
                                            fontStyle: "italic",
                                        }}>
                                            {evidencia.tipo}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} container justifyContent={"flex-end"}>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1rem", mr: 1 }}
                                        >
                                            Eliminar
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1rem", mr: 1 }}
                                        >
                                            Editar   {/* INCLUIR OTRO DIALOG PARA EDITAR EL ARCHIVO */}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="cuaternary"
                                            sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1rem" }}
                                        >
                                            Abrir
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Grid container>
                        <Grid item xs={12} container justifyContent="center">
                            <Button 
                                color="primary"
                                variant="contained" 
                                onClick={() => setOpenDialog(false)}
                                sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1rem", mr: 1 }}
                                >
                                Agregar Evidencia
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default NavbarEvidencia;
