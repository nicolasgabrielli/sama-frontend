import { Grid, Box, Button, Dialog, DialogContent, DialogActions, Typography, TextField, Select, MenuItem } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import React, { useEffect } from "react";
import reporteService from "../services/ReporteService";

function NavbarEvidencia({ evidencias, refreshEvidencias }) {
    const { idReporte } = useParams();
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openDialogAdjuntarEvidencia, setOpenDialogAdjuntarEvidencia] = React.useState(false);
    const [evidenciaActual, setEvidenciaActual] = React.useState(null);
    const [tipoEvidencia, setTipoEvidencia] = React.useState('archivo');
    const [paginaEvidencia, setPaginaEvidencia] = React.useState('');
    const [nombreEvidencia, setNombreEvidencia] = React.useState('');
    const [openDescargarReporteDialog, setOpenDescargarReporteDialog] = React.useState(false);

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

    const handleDescargarReporte = async (formato) => {
        try {
            const response = await reporteService.descargarReporte(idReporte, formato);

            // Verificar la estructura de la respuesta
            console.log('Response:', response);

            if (!response || !response.data) {
                throw new Error('No se recibió una respuesta válida del servidor.');
            }

            const headers = response.headers || {};
            console.log('Response headers:', headers);

            // Determinar el tipo de contenido basado en el formato
            let contentType;
            let extension;
            if (formato === 'pdf') {
                contentType = 'application/pdf';
                extension = 'pdf';
            } else if (formato === 'word') {
                contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                extension = 'docx';
            } else {
                throw new Error('Formato no soportado.');
            }

            // Convertir la respuesta a un blob
            const blob = new Blob([response.data], { type: contentType });

            if (formato === 'pdf') {
                // Crear una URL para el blob y abrirla en una nueva pestaña para PDFs
                const url = URL.createObjectURL(blob);
                window.open(url);
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 1000);
            } else if (formato === 'word') {
                // Crear una URL para el blob y simular un clic para descargar el archivo para Word
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `reporte.${extension}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error al descargar el reporte:', error);
        }
        setOpenDescargarReporteDialog(false);
    };

    function formatUrl(address) {
        // Elimina espacios en blanco al inicio y al final de la cadena
        address = address.trim();

        if (!address.startsWith('http://') && !address.startsWith('https://')) {
            address = 'https://' + address;
        }

        if (!address.endsWith('/')) {
            address = address + '/';
        }

        return address;
    };

    const handleAgregarEvidencia = async () => {
        const formData = new FormData();
        formData.append('nombre', nombreEvidencia);
        formData.append('tipo', tipoEvidencia);
        if (tipoEvidencia === 'archivo') {
            formData.append('archivo', evidenciaActual);
        } else {
            formData.append('url', paginaEvidencia);
        }
        await reporteService.crearEvidencia(idReporte, formData);
        refreshEvidencias();
        setOpenDialogAdjuntarEvidencia(false);
    };

    const handleEliminarEvidencia = async (idEvidencia) => {
        await reporteService.eliminarEvidencia(idEvidencia);
        refreshEvidencias();
    };

    const accederEvidencia = async (evidencia) => {
        try {
            if (evidencia.tipo.toLowerCase() === 'archivo') {
                let url = await reporteService.obtenerUrlS3(evidencia.id).then(response => response.data);
                if (url) {
                    window.open(url, '_blank');
                } else {
                    console.error('La URL obtenida del servicio S3 es nula o no válida.');
                }
            } else {
                window.open(formatUrl(evidencia.url), '_blank');
            }
        } catch (error) {
            console.error('Error al acceder a la evidencia:', error);
        }
    };


    return (
        <React.Fragment>
            <Box bgcolor="#fff" sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, boxShadow: "0px -4px 6px rgba(0, 0, 0, 0.1)", height: '80px' }}>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: '100%' }}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", mr: 1 }}
                                onClick={() => setOpenDialog(true)}
                            >
                                Gestionar Evidencias
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="cuaternary"
                                sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", color: "white" }}
                                onClick={() => setOpenDescargarReporteDialog(true)}
                            >
                                Descargar Reporte
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="error"
                                sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", color: "white" }}
                                //onClick={() => setOpenDescargarCrearPresetDialog(true)}
                            >
                                Guardar Preset
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
                                            {evidencia.tipo.toLowerCase() === 'archivo' ? evidencia.nombreOriginal : formatUrl(evidencia.url)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} container justifyContent={"flex-end"}>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1rem", mr: 1 }}
                                            onClick={() => handleEliminarEvidencia(evidencia.id)}
                                        >
                                            Eliminar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="cuaternary"
                                            sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1rem", color: "white" }}
                                            onClick={() => accederEvidencia(evidencia)}
                                        >
                                            {evidencia.tipo.toLowerCase() === 'archivo' ? "Descargar" : "Abrir"}
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
            <Dialog open={openDialogAdjuntarEvidencia} onClose={() => handleCloseAdjuntarEvidencia()} fullWidth>
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
                        <Typography variant="h6">Escriba el nombre de la evidencia:</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mt: 2, ml: 2 }}>
                        <TextField
                            label="Nombre de la Evidencia"
                            variant="outlined"
                            value={nombreEvidencia}
                            sx={{ width: "90%"}}
                            onChange={(e) => setNombreEvidencia(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', ml: 2, mt: 2 }}>
                        <Typography variant="h6">Seleccione el tipo de evidencia:</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mt: 2, ml: 2 }}>
                        <Select
                            value={tipoEvidencia}
                            onChange={(e) => setTipoEvidencia(e.target.value)}
                            variant="outlined"
                            sx={{ width: "50%", mr: 2 }}
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
                                    value={paginaEvidencia}
                                    sx={{ width: "90%" }}
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

            {/* Diálogo de descargar reporte */}
            <Dialog open={openDescargarReporteDialog} onClose={() => setOpenDescargarReporteDialog(false)} maxWidth="md" fullWidth>
                {/* Contenido del diálogo */}
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 1 }}>Descargar Reporte</Typography>
                        </Grid>
                        <Grid item xs={4} container justifyContent="flex-end" sx={{ mb: 2 }}>
                            <IconButton onClick={() => setOpenDescargarReporteDialog(false)} disableRipple><CloseIcon /></IconButton>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                        <Typography variant="h6">Seleccione el formato de descarga:</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mt: 2, ml: 2 }}>
                        <Button
                            variant="contained"
                            color="error"
                            sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1rem", mr: 2 }}
                            onClick={() => handleDescargarReporte("pdf")}
                            startIcon={<CloudDownloadIcon />}
                        >
                            Descargar PDF
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1rem", mr: 2 }}
                            onClick={() => handleDescargarReporte("word")}
                            startIcon={<CloudDownloadIcon />}
                        >
                            Descargar Word
                        </Button>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid container>
                        <Grid item xs={12} container justifyContent="flex-end">
                            <Button color="secondary" variant="text" onClick={() => setOpenDescargarReporteDialog(false)}>
                                Cancelar
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default NavbarEvidencia;
