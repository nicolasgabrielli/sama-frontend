import React, { useState } from "react";
import { Container, Typography, Paper, Button, Grid, Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel, Alert, Collapse } from "@mui/material";
import NavbarReporte from "./NavbarReporte";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

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
];

const porcentajeAutorizado = 0.33;

function Reporte() {
    const [openDialog, setOpenDialog] = useState(false);
    const [currentField, setCurrentField] = useState(null);
    const [editedField, setEditedField] = useState(null);
    const [alerta, setAlerta] = useState(false);
    const [alertaTexto, setAlertaTexto] = useState("");
    

    const handleOpenDialog = (campo) => {
        setCurrentField(campo);
        setEditedField({ ...campo });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditedField(null);
    };

    const handleOpenAlert = (texto) => {
        setAlerta(true);
        setAlertaTexto(texto);
    };

    const handleCloseAlert = () => {
        setAlerta(false);
    };

    const handleSaveField = () => {
        // Aquí se guardaría el campo editado usando axios.
        // La variable que tiene el campo editado es editedField, contiene la información del campo y los subcampos.

        // Validación de que los campos estén completos

        // Validación Campo
        const campo = editedField;
        if (campo.valor === "" || campo.valor === null || campo.valor === undefined) {
            handleOpenAlert("Por favor, complete el valor del campo.");
            return;
        }
        if (campo.nombre === "" || campo.nombre === null || campo.nombre === undefined) {
            handleOpenAlert("Por favor, complete el nombre del campo.");
            return;
        }

        // Validación Subcampos
        const subcampos = campo.subcampos;
        if (subcampos.length > 0) {
            for (let i = 0; i < subcampos.length; i++) {
                if (subcampos[i].valor === "" || subcampos[i].valor === null || subcampos[i].valor === undefined) {
                    handleOpenAlert("Por favor, complete todos los valores de los subcampos.");
                    return;
                }
                if (subcampos[i].nombre === "" || subcampos[i].nombre === null || subcampos[i].nombre === undefined) {
                    handleOpenAlert("Por favor, complete todos los nombres de los subcampos.");
                    return;
                }
            }
        }

        // Aquí se guardaría el campo editado usando axios.
        
        console.log(editedField);
        setOpenDialog(false);
    };

    const handleFieldChange = (event) => {
        const { name, value } = event.target;
        setEditedField({ ...editedField, [name]: value });
    };

    const handleAddSubcampo = () => {
        const newSubcampo = { nombre: "", valor: "", tipoDeDato: "string" };
        setEditedField({
            ...editedField,
            subcampos: [...(editedField.subcampos || []), newSubcampo]
        });
    };

    const handleDeleteSubcampo = (index) => {
        const newSubcampos = [...editedField.subcampos];
        newSubcampos.splice(index, 1);
        setEditedField({ ...editedField, subcampos: newSubcampos });
    }

    return (
        <>
            <NavbarReporte useSectionMode={useSectionMode} secciones={secciones} seccionesRutas={seccionesRutas} seccionActual={seccionActual} />
            <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', minWidth: '80vw' }}>
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
                {listaSecciones.map((seccion, index) => (
                    <Paper sx={{ mt: 2, p: 2, flexGrow: 1 }} key={index}>
                        <Typography variant="h5" color={"primary.main"} fontWeight={"bold"} sx={{ mb: 2 }}>
                            {seccion.nombre}
                        </Typography>
                        {seccion.campos.map((campo, index) => (
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
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1rem" }}
                                            onClick={() => handleOpenDialog(campo)}
                                        >
                                            Editar Campo
                                        </Button>
                                    </Grid>
                                </Grid>
                                {(campo.subcampos.length >= 1) && (
                                    <Grid item xs={12}>
                                        <Box sx={{ pl: 4, pr: 4 }}>
                                            {campo.subcampos.map((subcampo, index) => (
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
                                            ))}
                                        </Box>
                                    </Grid>
                                )}
                            </Box>
                        ))}
                        <Grid container justifyContent="center">
                            <Button
                                variant="outlined"
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
                ))}
                <Button variant="contained" color="primary" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1.5rem", my: 2 }}>
                    Agregar Sección
                </Button>
            </Container>

            {/* Diálogo para editar campos */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogContent>
                    {/* Título */}
                    <Typography
                        variant="h5"
                        color="primary"
                        fontWeight="bold"
                    >
                        Editar Campo
                    </Typography>

                    {/* Campo */}
                    {editedField && (
                        <>
                            <Grid container sx={{ p: 2 }}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Nombre"
                                        name="nombre"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={editedField.nombre}
                                        onChange={handleFieldChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Tipo de Dato</InputLabel>
                                        <Select
                                            label="Tipo de Dato"
                                            name="tipoDeDato"
                                            value={editedField.tipoDeDato}
                                            onChange={(event) => {
                                                const newCampo = { ...editedField };
                                                if (newCampo.tipoDeDato === "boolean") {
                                                    newCampo.valor = "";
                                                }
                                                if ((newCampo.tipoDeDato === "string" || newCampo.tipoDeDato === "number") && event.target.value === "boolean") {
                                                    newCampo.valor = true;
                                                }
                                                newCampo.tipoDeDato = event.target.value;
                                                setEditedField({ ...editedField, tipoDeDato: event.target.value, valor: newCampo.valor });
                                            }}
                                        >
                                            <MenuItem value="string">Texto</MenuItem>
                                            <MenuItem value="number">Número</MenuItem>
                                            <MenuItem value="boolean">Booleano</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    {editedField.tipoDeDato === "boolean" ? (
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel>Valor</InputLabel>
                                            <Select
                                                label="Valor"
                                                name="valor"
                                                variant="outlined"
                                                fullWidth
                                                margin="normal"
                                                value={editedField.valor}
                                                onChange={handleFieldChange}
                                            >
                                                <MenuItem value={true}>Sí</MenuItem>
                                                <MenuItem value={false}>No</MenuItem>
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        <TextField
                                            label="Valor"
                                            name="valor"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            value={editedField.valor}
                                            onChange={handleFieldChange}
                                        />
                                    )}
                                </Grid>

                                {/* Subcampos */}

                                <Grid item xs={12}>
                                    <Typography
                                        variant="h6"
                                        sx={{ mt: 2 }}
                                        color="primary.main"
                                    >
                                        Subcampos
                                    </Typography>
                                    {editedField.subcampos.map((subcampo, index) => (
                                        <Grid container key={index} sx={{ mb: 1, p: 2 }} borderBottom={1} borderColor={"secondary.main"}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Nombre del Subcampo"
                                                    name={`subcampo-nombre-${index}`}
                                                    variant="outlined"
                                                    fullWidth
                                                    margin="normal"
                                                    value={subcampo.nombre}
                                                    onChange={(event) => {
                                                        const newSubcampos = [...editedField.subcampos];
                                                        newSubcampos[index].nombre = event.target.value;
                                                        setEditedField({ ...editedField, subcampos: newSubcampos });
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth margin="normal">
                                                    <InputLabel>Tipo de Dato</InputLabel>
                                                    <Select
                                                        label="Tipo de Dato"
                                                        name={`subcampo-tipoDeDato-${index}`}
                                                        value={subcampo.tipoDeDato}
                                                        onChange={(event) => {
                                                            const newSubcampos = [...editedField.subcampos];
                                                            if (newSubcampos[index].tipoDeDato === "boolean") {
                                                                newSubcampos[index].valor = "";
                                                            }
                                                            newSubcampos[index].tipoDeDato = event.target.value;
                                                            setEditedField({ ...editedField, subcampos: newSubcampos });
                                                        }}
                                                    >
                                                        <MenuItem value="string">Texto</MenuItem>
                                                        <MenuItem value="number">Número</MenuItem>
                                                        <MenuItem value="boolean">Booleano</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                {subcampo.tipoDeDato === "boolean" ? (
                                                    <FormControl fullWidth margin="normal">
                                                        <InputLabel>Valor del Subcampo</InputLabel>
                                                        <Select
                                                            label="Valor del Subcampo"
                                                            name={`subcampo-valor-${index}`}
                                                            variant="outlined"
                                                            fullWidth
                                                            margin="normal"
                                                            value={subcampo.valor}
                                                            onChange={(event) => {
                                                                const newSubcampos = [...editedField.subcampos];
                                                                newSubcampos[index].valor = event.target.value;
                                                                setEditedField({ ...editedField, subcampos: newSubcampos });
                                                            }}
                                                        >
                                                            <MenuItem value={true}>Sí</MenuItem>
                                                            <MenuItem value={false}>No</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                ) : (
                                                    <TextField
                                                        label="Valor del Subcampo"
                                                        name={`subcampo-valor-${index}`}
                                                        variant="outlined"
                                                        fullWidth
                                                        margin="normal"
                                                        value={subcampo.valor}
                                                        onChange={(event) => {
                                                            const newSubcampos = [...editedField.subcampos];
                                                            newSubcampos[index].valor = event.target.value;
                                                            setEditedField({ ...editedField, subcampos: newSubcampos });
                                                        }}
                                                    />
                                                )}
                                            </Grid>
                                            <Grid container justifyContent="center">
                                                <Button color="error" onClick={() => handleDeleteSubcampo(index)}>
                                                    <CloseIcon />
                                                    Eliminar Subcampo
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Grid item xs={12} container justifyContent="center">
                                    <Button color="cuaternary" variant="text" onClick={() => handleAddSubcampo()}>
                                        <AddIcon />
                                        Agregar Subcampo
                                    </Button>
                                </Grid>
                            </Grid>

                        </>
                    )}
                </DialogContent>
                <DialogActions sx={{ minHeight: "50px"}}>
                    {/* Alerta */}
                    <Collapse in={alerta}>
                        <Alert severity="error" onClose={handleCloseAlert}>
                            {alertaTexto}
                        </Alert>
                    </Collapse>
                    <Button onClick={handleCloseDialog} color="secondary">Descartar</Button>
                    <Button onClick={handleSaveField} color="primary">Guardar</Button>
                </DialogActions>
            </Dialog>



        </>
    );
}

export default Reporte;
