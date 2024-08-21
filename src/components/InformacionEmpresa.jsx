import React from 'react';
import { Typography, Grid, Paper, Button, IconButton, Box } from '@mui/material';
import { Link } from 'react-router-dom';  // Importamos useNavigate
import EditNoteIcon from '@mui/icons-material/EditNote';

const InformacionEmpresa = ({ infoEmpresa, usuarioLogeado }) => {

    return (
        <Grid item xs={12} md={3}>
            <Paper sx={{ mt: 2, p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                        Información de la Empresa
                    </Typography>
                    {usuarioLogeado && usuarioLogeado.rol === "0" && (
                        <IconButton
                            variant="outlined"
                            sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", ml: 2 }}
                            component={Link}
                            to={`/empresas/${infoEmpresa.id}`}
                        >
                            <EditNoteIcon />
                        </IconButton>
                    )}
                </Box>

                <Grid container alignItems="center" justifyContent="space-between" borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, mb: 1, py: 1 }}>
                    <Typography variant="h7">Nombre: {infoEmpresa.nombre}</Typography>
                </Grid>
                <Grid container alignItems="center" justifyContent="space-between" borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, mb: 1, py: 1 }}>
                    <Typography variant="h7">Tipo de sociedad: {infoEmpresa.tipoSociedad}</Typography>
                </Grid>
                <Grid container alignItems="center" justifyContent="space-between" borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, mb: 1, py: 1 }}>
                    <Typography variant="h7">RUT: {infoEmpresa.rut}</Typography>
                </Grid>
                {infoEmpresa.domicilioEmpresa && (
                    <Grid container alignItems="center" justifyContent="space-between" borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, mb: 1, py: 1 }}>
                        <Typography variant="h7">Domicilio: {infoEmpresa.domicilioEmpresa}</Typography>
                    </Grid>
                )}
                {infoEmpresa.paginaWeb && (
                    <Grid container alignItems="center" justifyContent="space-between" borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, mb: 1, py: 1 }}>
                        <Typography variant="h7">Página Web: {infoEmpresa.paginaWeb}</Typography>
                    </Grid>
                )}
                {(infoEmpresa.email || infoEmpresa.domicilioContacto || infoEmpresa.telefono) && (
                    <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mb: 2, mt: 2 }}>Punto de Contacto</Typography>
                )}

                {infoEmpresa.email && (
                    <Grid container alignItems="center" justifyContent="space-between" borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, mb: 1, py: 1 }}>
                        <Typography variant="h7">Email: {infoEmpresa.email}</Typography>
                    </Grid>
                )}
                {infoEmpresa.domicilioContacto && (
                    <Grid container alignItems="center" justifyContent="space-between" borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, mb: 1, py: 1 }}>
                        <Typography variant="h7">Domicilio de contacto: {infoEmpresa.domicilioContacto}</Typography>
                    </Grid>
                )}
                {infoEmpresa.telefono && (
                    <Grid container alignItems="center" justifyContent="space-between" borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, mb: 1, py: 1 }}>
                        <Typography variant="h7">Teléfono: {infoEmpresa.telefono}</Typography>
                    </Grid>
                )}


            </Paper>
        </Grid>
    );
};

export default InformacionEmpresa;
