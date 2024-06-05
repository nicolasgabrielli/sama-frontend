import { Grid, Box, Button, Dialog, DialogContent, DialogActions, Typography, TextField, Select, MenuItem } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React, { useEffect } from "react";

function NavbarEvidencia({ evidencias, refreshEvidencias }) {
    const { idReporte } = useParams();
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openDialogAdjuntarEvidencia, setOpenDialogAdjuntarEvidencia] = React.useState(false);
    const [evidenciaActual, setEvidenciaActual] = React.useState(null);
    const [tipoEvidencia, setTipoEvidencia] = React.useState('archivo');
    const [paginaEvidencia, setPaginaEvidencia] = React.useState('');


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setEvidenciaActual(file);
    };

    const handleOpenAdjuntarEvidencia = () => {
        setOpenDialogAdjuntarEvidencia(true);
    };

    const handleCloseAdjuntarEvidencia = () => {
        setOpenDialogAdjuntarEvidencia(false);
        setEvidenciaActual(null);
        setTipoEvidencia('archivo');
        setPaginaEvidencia('');
    };

    const handleAgregarEvidencia = async () => {
        // Lógica para agregar evidencia
        setOpenDialogAdjuntarEvidencia(false);
    };

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
            {/* Diálogo de gestión de evidencias */}
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
                                            variant="h6"
                                            color="#000000"
                                            sx={{ fontFamily: "Segoe UI", fontWeight: "bold" }}
                                        >
                                            {evidencia.nombre}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3} container>
                                        <Typography variant="h6" color={"primary"} sx={{
                                            fontFamily: "Segoe UI",
                                            fontStyle: "italic",
                                            fontWeight: "bold"
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
                                onClick={() => handleOpenAdjuntarEvidencia()}
                                sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1rem", mr: 1 }}
                            >
                                Agregar Evidencia
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/* Diálogo de adjuntar evidencia */}
            <Dialog open={openDialogAdjuntarEvidencia} onClose={() => handleCloseAdjuntarEvidencia()} maxWidth="md" fullWidth>
                {/* Contenido del diálogo */}
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 1 }}>Adjuntar Evidencia</Typography>
                        </Grid>
                        <Grid item xs={4} container justifyContent="flex-end" sx={{ mb: 2 }}>
                            <IconButton onClick={() => setOpenDialogAdjuntarEvidencia(false)} disableRipple><CloseIcon /></IconButton>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                        <Typography variant="h6">Seleccione el tipo de evidencia:</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mt: 2, ml: 2 }}>
                        <Select
                            value={tipoEvidencia}
                            onChange={(e) => setTipoEvidencia(e.target.value)}
                            variant="outlined"
                            sx={{ minWidth: '120px', mr: 2 }}
                        >
                            <MenuItem value="archivo">Archivo</MenuItem>
                            <MenuItem value="pagina">Página</MenuItem>
                        </Select>
                    </Grid>
                    {tipoEvidencia === 'archivo' && (
                        <>
                        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mt: 2, ml: 2 }}>
                            <Typography variant="h6">Seleccione el archivo:</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mt: 2, ml: 2 }}>
                            <Button
                                variant="contained"
                                component="label"
                                sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1rem" }}
                                startIcon={<CloudUploadIcon />}
                            >
                                Adjuntar Archivo
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileChange}
                                />
                            </Button>
                            <Typography sx={{ marginLeft: 1 }}>
                                {evidenciaActual ? evidenciaActual.name : "No se ha seleccionado un archivo"}
                            </Typography>
                        </Grid>
                        </>
                    )}
                    {tipoEvidencia === 'pagina' && (
                        <>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mt: 2, ml: 2 }}>
                                <Typography variant="h6">Escriba el URL de la evidencia:</Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mt: 2, ml: 2 }}>
                                <TextField
                                    label="Escribir URL"
                                    variant="outlined"
                                    size="small"
                                    value={paginaEvidencia}
                                    onChange={(e) => setPaginaEvidencia(e.target.value)}
                                />
                            </Grid>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Grid container>
                        <Grid item xs={12} container justifyContent="flex-end">
                            <Button color="secondary" variant="text" onClick={() => handleCloseAdjuntarEvidencia()}>
                                Cancelar
                            </Button>
                            <Button color="primary" variant="text" onClick={() => handleAgregarEvidencia()}>
                                Subir
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default NavbarEvidencia;
