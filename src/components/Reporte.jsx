import React from "react";
import { Container, Typography, Paper, Button, Grid, Box } from "@mui/material";
import NavbarReporte from "./NavbarReporte";

const secciones = ["Perfil Entidad", "Modelo de Negocio", "Gestión de Proveedores", "Gobierno Corporativo", "Estrategia", "Indicadores", "Hechos Relevantes", "Personas"];
const seccionesRutas = [];
const seccionActual = "Perfil Entidad";
const useSectionMode = true;

const listaSecciones = [
    {
        nombre: "Misión, Visión, Propósito y Valores",
        campos: [
            {
                nombre: "Misión",
                valor: "Ser la mejor empresa en el ramo de la construcción",
                tipoDeDato: "string",
                tieneSubcampos: false,
                subcampos: []
            },
            {
                nombre: "Visión",
                valor: "Ser la empresa líder en el ramo de la construcción",
                tipoDeDato: "string",
                tieneSubcampos: false,
                subcampos: []
            },
            {
                nombre: "Propósito",
                valor: "Construir edificaciones de calidad",
                tipoDeDato: "string",
                tieneSubcampos: false,
                subcampos: []
            },
            {
                nombre: "Valores",
                valor: true,
                tipoDeDato: "boolean",
                tieneSubcampos: true,
                subcampos: [
                    {
                        nombre: "Honestidad",
                        valor: "Ser honestos en todo lo que hacemos",
                        tipoDeDato: "string"
                    },
                    {
                        nombre: "Responsabilidad",
                        valor: "Ser responsables en todo lo que hacemos",
                        tipoDeDato: "string"
                    },
                    {
                        nombre: "Compromiso",
                        valor: "Ser comprometidos en todo lo que hacemos",
                        tipoDeDato: "string"
                    }
                ]
            }
        ]
    },
    {
        nombre: "Información Histórica",
        campos: [
            {
                nombre: "Año de Fundación",
                valor: "2000",
                tipoDeDato: "number",
                tieneSubcampos: false,
                subcampos: []
            },
            {
                nombre: "Cantidad de Empleados",
                valor: "100",
                tipoDeDato: "number",
                tieneSubcampos: false,
                subcampos: []
            }
        ]
    }
]
const porcentajeAutorizado = 0.33;

function Reporte() {
    return (
        <>
            <NavbarReporte useSectionMode={useSectionMode} secciones={secciones} seccionesRutas={seccionesRutas} seccionActual={seccionActual} />
            <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', minWidth: '80vw' }}>
                {/* Titulo categoría */}
                <Paper sx={{ mt: 2, p: 2, flexGrow: 1 }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <Typography variant="h4" color={"primary.main"} fontWeight={"bold"}>
                                {seccionActual}
                            </Typography>
                        </Grid>
                        <Grid item>
                            {/* Porcentaje de autorización */}
                            <Typography variant="h5" color={"red"} sx={{ fontFamily: "Segoe UI", fontWeight: "bold", fontStyle: "italic" }}>
                                {/*{porcentajeAutorizado * 100}% Autorizado */}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
                {/* Contenido categoría */}
                {listaSecciones.map((seccion, index) => {
                    return (
                        <Paper sx={{ mt: 2, p: 2, flexGrow: 1 }} key={index}>
                            <Typography variant="h5" color={"primary.main"} fontWeight={"bold"} sx={{ mb: 2 }}>
                                {seccion.nombre}
                            </Typography>
                            {seccion.campos.map((campo, index) => {
                                return (
                                    <Box sx={{ pl: 2, pr: 2, mb: 2 }} key={index}>
                                        <Grid container alignItems="center" justifyContent="space-between" borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, py: 1 }}>
                                            <Grid item xs={4}>
                                                <Typography variant="h5" color={"#000000"} sx={{ fontFamily: "Segoe UI" }}>
                                                    {campo.nombre}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4} container>
                                                <Typography variant="h5" color={"#000000"} sx={{
                                                    fontFamily: "Segoe UI",
                                                    fontStyle: "italic",
                                                    color: campo.tipoDeDato === "boolean" ? (campo.valor ? "green" : "red") : undefined
                                                }}>
                                                    {(() => {
                                                        if (campo.tipoDeDato === "string") {
                                                            return campo.valor;
                                                        } else if (campo.tipoDeDato === "number") {
                                                            return campo.valor;
                                                        } else if (campo.tipoDeDato === "boolean") {
                                                            return campo.valor ? "Sí" : "No";
                                                        }
                                                    })()}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4} container justifyContent={"flex-end"}>
                                                <Button variant="outlined" color="primary" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1rem" }}>
                                                    Editar Campo
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        {campo.tieneSubcampos && (
                                            <Grid item xs={12}>
                                                <Box sx={{ pl: 4, pr: 4 }}>
                                                    {campo.subcampos.map((subcampo, index) => {
                                                        return (
                                                            <Grid container alignItems="center" justifyContent="space-between" borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, mb: 1, py: 1 }} key={index}>
                                                                <Grid item xs={6}>
                                                                    <Typography variant="h6" color={"#000000"} sx={{ fontFamily: "Segoe UI", fontWeight: "normal" }}>
                                                                        {subcampo.nombre}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={6} container>
                                                                    <Typography variant="h6" color={"#000000"} sx={{ fontFamily: "Segoe UI", fontWeight: "normal", fontStyle: "italic" }}>
                                                                        {subcampo.valor}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        );
                                                    })}
                                                </Box>
                                            </Grid>
                                        )}
                                    </Box>
                                );
                            })}
                            <Grid container justifyContent="center">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        textTransform: "none",
                                        fontWeight: "bold",
                                        fontStyle: "italic",
                                        fontSize: "1rem",
                                        mt: 2,
                                    }}
                                >
                                    Agregar Campo
                                </Button>
                            </Grid>

                        </Paper>
                    );
                })}
                <Button variant="contained" color="primary" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1.5rem", mt: 2 }}>
                    Agregar Sección
                </Button>
            </Container>
        </>
    );
}



export default Reporte;