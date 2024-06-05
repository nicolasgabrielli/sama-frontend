import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Box, Checkbox, FormControlLabel, Button, Collapse, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import reporteService from "../services/ReporteService";
import NavbarReporte from "./NavbarReporte";
import NavbarEvidencia from './NavbarEvidencia';

function Reporte() {
    const { idReporte } = useParams();
    const [reporte, setReporte] = useState(null);
    const [tituloReporte, setTituloReporte] = useState("");
    const [anioReporte, setAnioReporte] = useState("");
    const [categoriaActualIndex, setCategoriaActualIndex] = useState(0);
    const [seccionActualIndex, setSeccionActualIndex] = useState(0);
    const [categorias, setCategorias] = useState([]);
    const [secciones, setSecciones] = useState([]);

    useEffect(() => {
        reporteService.obtenerReporte(idReporte)
            .then(response => response.data)
            .then(data => {
                setReporte(data);
                setTituloReporte(data.titulo);
                const categoriasObtenidas = data.categorias || [];
                setCategorias(categoriasObtenidas.map(categoria => categoria.titulo));
                if (categoriasObtenidas.length > 0) {
                    setSecciones(categoriasObtenidas[0].secciones || []);
                }
            })
            .catch(error => console.error('Error al obtener el reporte:', error));
    }, [idReporte]);

    const handleCategoriaChange = (index) => {
        setSecciones(reporte.categorias[index].secciones || []);
        setCategoriaActualIndex(index);
    };

    const refreshReporte = () => {
        reporteService.obtenerReporte(idReporte)
            .then(response => response.data)
            .then(data => {
                setReporte(data);
                setTituloReporte(data.titulo);
                setAnioReporte(data.anio);
                const categoriasObtenidas = data.categorias || [];
                setCategorias(categoriasObtenidas.map(categoria => categoria.titulo));
                if (categoriasObtenidas.length > 0) {
                    setSecciones(categoriasObtenidas[categoriaActualIndex].secciones || []);
                }
            })
            .catch(error => console.error('Error al obtener el reporte:', error));
    };

    const [openDialog, setOpenDialog] = useState(false);
    const [openSectionDialog, setOpenSectionDialog] = useState(false);
    const [openSectionEditDialog, setOpenSectionEditDialog] = useState(false);
    const [openCategoryEditDialog, setOpenCategoryEditDialog] = useState(false);
    const [editedField, setEditedField] = useState({ titulo: "", contenido: "", tipo: "Texto", subCampos: [] });
    const [currentField, setCurrentField] = useState({ titulo: "", contenido: "", tipo: "Texto", subCampos: [] });
    const [alerta, setAlerta] = useState(false);
    const [alertaTexto, setAlertaTexto] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [editedSection, setEditedSection] = useState({ titulo: "" });
    const [openEliminarCampoDialog, setOpenEliminarCampoDialog] = useState(false);
    const [tituloIngresado, setTituloIngresado] = useState("");
    const [openEliminarCategoriaDialog, setOpenEliminarCategoriaDialog] = useState(false);
    const [openEliminarSeccionDialog, setOpenEliminarSeccionDialog] = useState(false);
    const [campoActualIndex, setCampoActualIndex] = useState(0);
    const [evidencias, setEvidencias] = useState([
        { nombre: "Evidencia 1", tipo: "Archivo.pdf" }, 
        { nombre: "Evidencia 2", tipo: "https://pagina.com/" }, 
        { nombre: "Evidencia 3", tipo: "Archivo.xsls" },
        { nombre: "Evidencia 4", tipo: "Archivo.docx" },
        { nombre: "Evidencia 5", tipo: "https://pagina.com/" },
        { nombre: "Evidencia 6", tipo: "Archivo.pdf" },
        { nombre: "Evidencia 7", tipo: "https://pagina.com/" },
        { nombre: "Evidencia 8", tipo: "Archivo.xsls" },
        { nombre: "Evidencia 9", tipo: "Archivo.docx" },
        { nombre: "Evidencia 10", tipo: "https://pagina.com/" },
        { nombre: "Evidencia 11", tipo: "Archivo.pdf" },
        { nombre: "Evidencia 12", tipo: "https://pagina.com/" },
        { nombre: "Evidencia 13", tipo: "Archivo.xsls" },
        { nombre: "Evidencia 14", tipo: "Archivo.docx" },
        { nombre: "Evidencia 15", tipo: "https://pagina.com/" },
        { nombre: "Evidencia 16", tipo: "Archivo.pdf" },
        { nombre: "Evidencia 17", tipo: "https://pagina.com/" },
        { nombre: "Evidencia 18", tipo: "Archivo.xsls" },
        { nombre: "Evidencia 19", tipo: "Archivo.docx" },
        { nombre: "Evidencia 20", tipo: "https://pagina.com/" },
    ]);
    const [filteredEvidencia, setFilteredEvidencia] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEvidencias, setSelectedEvidencias] = useState([]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        refreshFilteredEvidencia(event.target.value, selectedEvidencias);
    };

    const handleAgregarEvidenciaAlCampo = (evidencia) => {
        if (!selectedEvidencias.includes(evidencia)) {
            selectedEvidencias.push(evidencia);
        }
        refreshFilteredEvidencia(searchTerm, selectedEvidencias);
        // Ordenar por orden alfabético y numérico
        selectedEvidencias.sort((a, b) => {
            // Función de comparación personalizada
            const regex = /\d+/; // Expresión regular para encontrar números
    
            // Extraer los números de los nombres de las evidencias
            const numA = parseInt(a.nombre.match(regex)?.[0]) || 0;
            const numB = parseInt(b.nombre.match(regex)?.[0]) || 0;
    
            // Comparar los números como cadenas para tener en cuenta la longitud
            const strNumA = numA.toString();
            const strNumB = numB.toString();
    
            if (strNumA.length !== strNumB.length) {
                return strNumA.length - strNumB.length; // Ordenar por longitud ascendente
            } else {
                return strNumA.localeCompare(strNumB); // Ordenar como cadenas
            }
        });
    };

    const handleRemoverEvidenciaDelCampo = (evidencia) => {
        if (selectedEvidencias.includes(evidencia)) {
            selectedEvidencias.splice(selectedEvidencias.indexOf(evidencia), 1);
        }
        refreshFilteredEvidencia(searchTerm, selectedEvidencias);
        // Ordenar por orden alfabético y numérico
        selectedEvidencias.sort((a, b) => {
            // Función de comparación personalizada
            const regex = /\d+/; // Expresión regular para encontrar números
    
            // Extraer los números de los nombres de las evidencias
            const numA = parseInt(a.nombre.match(regex)?.[0]) || 0;
            const numB = parseInt(b.nombre.match(regex)?.[0]) || 0;
    
            // Comparar los números como cadenas para tener en cuenta la longitud
            const strNumA = numA.toString();
            const strNumB = numB.toString();
    
            if (strNumA.length !== strNumB.length) {
                return strNumA.length - strNumB.length; // Ordenar por longitud ascendente
            } else {
                return strNumA.localeCompare(strNumB); // Ordenar como cadenas
            }
        });
        
    };

    const refreshFilteredEvidencia = (searchTermParam = searchTerm, selectedEvidenciasParam = selectedEvidencias) => {
        // Se filtran las evidencias que no están seleccionadas
        const filtered = evidencias.filter(evidencia =>
            (evidencia.nombre.toLowerCase().includes(searchTermParam.toLowerCase()) ||
                evidencia.tipo.toLowerCase().includes(searchTermParam.toLowerCase()) || searchTermParam === "") &&
            !selectedEvidenciasParam.includes(evidencia)
        );
    
        // Ordenar por orden alfabético y numérico
        filtered.sort((a, b) => {
            // Función de comparación personalizada
            const regex = /\d+/; // Expresión regular para encontrar números
    
            // Extraer los números de los nombres de las evidencias
            const numA = parseInt(a.nombre.match(regex)?.[0]) || 0;
            const numB = parseInt(b.nombre.match(regex)?.[0]) || 0;
    
            // Comparar los números como cadenas para tener en cuenta la longitud
            const strNumA = numA.toString();
            const strNumB = numB.toString();
    
            if (strNumA.length !== strNumB.length) {
                return strNumA.length - strNumB.length; // Ordenar por longitud ascendente
            } else {
                return strNumA.localeCompare(strNumB); // Ordenar como cadenas
            }
        });
    
        setFilteredEvidencia(filtered);
    };
    

    const handleOpenEditDialog = (campo, section = null, indexSeccion) => {
        setCurrentField(campo);
        setEditedField({
            ...campo,
            subCampos: campo ? JSON.parse(JSON.stringify(campo.subCampos || [])) : [] // Clonar correctamente los subcampos
        });
        setIsAdding(!campo);
        refreshFilteredEvidencia();
        setSeccionActualIndex(indexSeccion);
        setOpenDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenDialog(false);
        setEditedField(null);
        setIsAdding(false);
        setSelectedEvidencias([]);
        setFilteredEvidencia([]);
        setSearchTerm("");
    };

    const handleEliminarCampoDialog = (campoIndex, indexSeccion) => {
        setCampoActualIndex(campoIndex);
        setSeccionActualIndex(indexSeccion);
        setOpenEliminarCampoDialog(true);
    };

    const handleCerrarEliminarCampoDialog = () => {
        setOpenEliminarCampoDialog(false);
    };

    const handleOpenSectionEditDialog = (seccionIndex) => {
        setOpenSectionEditDialog(true);
        setSeccionActualIndex(seccionIndex)
        setEditedSection({ titulo: secciones[seccionIndex].titulo });
    };

    const handleCloseSectionEditDialog = () => {
        setOpenSectionEditDialog(false);
        setEditedSection({ titulo: "" });
    };

    const handleOpenAlert = (texto) => {
        setAlerta(true);
        setAlertaTexto(texto);
    };

    const handleCloseAlert = () => {
        setAlerta(false);
    };

    const handleEliminarCategoria = async () => {
        let coordenadas = {
            indexCategoria: categoriaActualIndex
        }
        await reporteService.eliminarContenido(idReporte, coordenadas);
        setCategorias(categorias.filter((categoria, index) => index !== categoriaActualIndex));
        setCategoriaActualIndex(0);
        refreshReporte();
        setOpenEliminarCategoriaDialog(false);
    };

    const handleOpenEliminarSeccion = (indexSeccion) => {
        setSeccionActualIndex(indexSeccion);
        setOpenEliminarSeccionDialog(true);
    };

    const handleEliminarSeccion = async () => {
        let coordenadas = {
            indexCategoria: categoriaActualIndex,
            indexSeccion: seccionActualIndex
        }
        await reporteService.eliminarContenido(idReporte, coordenadas);
        refreshReporte();
        setOpenEliminarSeccionDialog(false);
    };

    const handleEliminarCampo = () => {
        if (campoActualIndex !== -1) {
            let coordenadas = {
                indexCategoria: categoriaActualIndex,
                indexSeccion: seccionActualIndex,
                indexCampo: campoActualIndex,
            }
            reporteService.eliminarContenido(idReporte, coordenadas);
            setSecciones(secciones.map((seccion, index) => {
                if (index === seccionActualIndex) {
                    return {
                        ...seccion,
                        campos: seccion.campos.filter((c, i) => i !== campoActualIndex)
                    };
                }
                return seccion;
            }));
        }
        else {
            console.log("error al eliminar campo");
        }
        setOpenEliminarCampoDialog(false);
    };

    // Función para guardar el campo editado o agregado
    const handleSaveField = () => {
        // La variable que tiene el campo editado es editedField, contiene la información del campo y los subCampos.

        // Validación Campo
        const campo = editedField;
        if (campo.contenido === "" || campo.contenido === null || campo.contenido === undefined) {
            handleOpenAlert("Por favor, complete el contenido del campo.");
            return;
        }
        if (campo.titulo === "" || campo.titulo === null || campo.titulo === undefined) {
            handleOpenAlert("Por favor, complete el titulo del campo.");
            return;
        }

        // Validación Subcampos
        if (campo.subCampos != null && campo.subCampos.length > 0) {
            const subCampos = campo.subCampos;
            for (let i = 0; i < subCampos.length; i++) {
                if (subCampos[i].contenido === "" || subCampos[i].contenido === null || subCampos[i].contenido === undefined) {
                    handleOpenAlert("Por favor, complete todos los valores de los subCampos.");
                    return;
                }
                if (subCampos[i].titulo === "" || subCampos[i].titulo === null || subCampos[i].titulo === undefined) {
                    handleOpenAlert("Por favor, complete todos los titulos de los subCampos.");
                    return;
                }
            }
        }
        let campoIndex = 0;
        let seccionIndex = seccionActualIndex;
        if (isAdding) {
            campoIndex = secciones[seccionActualIndex].campos.length;
            let newReporte = {
                coordenadas: {
                    indexCategoria: categoriaActualIndex,
                    indexSeccion: seccionIndex,
                    indexCampo: campoIndex
                },
                nuevoTituloCategoria: categorias[categoriaActualIndex],
                nuevoTituloSeccion: secciones[seccionIndex].titulo,
                nuevoCampo: editedField
            }
            setSecciones(secciones.map((seccion, index) => {
                if (index === seccionIndex) {
                    return {
                        ...seccion,
                        campos: [...seccion.campos, editedField]
                    };
                }
                return seccion;
            }));
            reporteService.actualizarReporte(newReporte, idReporte);
        }
        else {
            campoIndex = secciones[seccionIndex].campos.findIndex(c => c === currentField);
            if (campoIndex !== -1) {
                let newReporte = {
                    coordenadas: {
                        indexCategoria: categoriaActualIndex,
                        indexSeccion: seccionIndex,
                        indexCampo: campoIndex,
                    },
                    nuevoTituloCategoria: categorias[categoriaActualIndex],
                    nuevoTituloSeccion: secciones[seccionIndex].titulo,
                    nuevoCampo: editedField
                }
                setSecciones(secciones.map((seccion, index) => {
                    if (index === seccionIndex) {
                        return {
                            ...seccion,
                            campos: seccion.campos.map((campo, index) => {
                                if (index === campoIndex) {
                                    return editedField;
                                }
                                return campo;
                            })
                        };
                    }
                    return seccion;
                }));
                reporteService.actualizarReporte(newReporte, idReporte);
            }
            else {
                console.log("error al guardar campo");
            }
        }

        setOpenDialog(false);
    };

    const handleSaveSection = async (agregar) => {
        // Validación de que los campos estén completos
        const seccion = editedSection;
        if (seccion.titulo === "" || seccion.titulo === null || seccion.titulo === undefined) {
            handleOpenAlert("Por favor, complete el titulo de la sección.");
            return;
        }

        let indexSeccion = seccionActualIndex;
        // Ojalá se puediera refrescar la página después de guardar la sección.
        if (agregar) {
            indexSeccion = secciones.length;
        }
        const newReporte = {
            coordenadas: {
                indexCategoria: categoriaActualIndex,
                indexSeccion: indexSeccion,
                indexCampo: null

            },
            nuevoTituloCategoria: categorias[categoriaActualIndex],
            nuevoTituloSeccion: seccion.titulo,
            nuevoCampo: {}
        }
        setSecciones(secciones.map((seccion, index) => {
            if (index === seccionActualIndex) {
                return {
                    ...seccion,
                    titulo: seccion.titulo
                };
            }
            return seccion;
        }));
        try {
            await reporteService.actualizarReporte(newReporte, idReporte);
            refreshReporte();
        } catch (error) {
            console.error('Error al guardar la sección:', error);
        }
        setOpenSectionEditDialog(false);
        setOpenSectionDialog(false);
    };

    // Función para editar el titulo de la categoría
    const handleEditCategory = async () => {
        // Validación de que el titulo esté completo
        if (tituloIngresado === "" || tituloIngresado === null || tituloIngresado === undefined) {
            handleOpenAlert("Por favor, complete el titulo de la categoría.");
            return;
        }

        // Ojalá se puediera refrescar la página después de guardar la categoría.
        const newReporte = {
            coordenadas: {
                indexCategoria: categoriaActualIndex
            },
            nuevoTituloCategoria: tituloIngresado
        }
        setCategorias(categorias.map((categoria, index) => {
            if (index === categoriaActualIndex) {
                return tituloIngresado;
            }
            return categoria;
        }));
        try {
            await reporteService.actualizarReporte(newReporte, idReporte);
        } catch (error) {
            console.error('Error al guardar la categoría:', error);
        }
        setTituloIngresado("");
        setOpenCategoryEditDialog(false);
    };

    const handleFieldChange = (event) => {
        const { name, value } = event.target;
        if (name.startsWith('subCampos')) {
            const subcampoIndex = parseInt(name.split('-')[2]);
            const newSubCampos = [...editedField.subCampos];
            newSubCampos[subcampoIndex][name.split('-')[1]] = value;
            setEditedField({ ...editedField, subCampos: newSubCampos });
        } else {
            setEditedField({ ...editedField, [name]: value });
        }
    };

    const handleAddSubcampo = () => {
        const newSubcampo = { titulo: "", contenido: "", tipo: "Texto" };
        setEditedField({
            ...editedField,
            subCampos: [...(editedField.subCampos || []), newSubcampo]
        });
    };

    const handleDeleteSubcampo = (index) => {
        const newSubcampos = [...editedField.subCampos];
        newSubcampos.splice(index, 1);
        setEditedField({ ...editedField, subCampos: newSubcampos });
    }

    return (
        <>
            <NavbarReporte
                useSectionMode={true}
                categorias={categorias}
                categoriaActualIndex={categoriaActualIndex}
                onCategoriaChange={handleCategoriaChange}
                tituloReporte={tituloReporte}
                anioReporte={anioReporte}
                refreshReporte={refreshReporte}
            />
            <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', minWidth: '80vw', pb: '100px' }}>
                <Paper sx={{ mt: 2, p: 2, flexGrow: 1 }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item xs={8}>
                            <Typography variant="h4" color={"primary.main"} fontWeight={"bold"}>
                                {categorias[categoriaActualIndex]}
                            </Typography>
                        </Grid>
                        <Grid item xs={4} container justifyContent="flex-end">
                            <Button
                                variant="outlined"
                                color="error"
                                sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1rem", mr: 1 }}
                                onClick={() => setOpenEliminarCategoriaDialog(true)}
                            >
                                Eliminar Categoría
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1rem" }}
                                onClick={() => setOpenCategoryEditDialog(true)}
                            >
                                Editar Categoría
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
                {secciones.map((seccion, indexSeccion) => (
                    <Paper sx={{ mt: 2, p: 2, flexGrow: 1 }} key={indexSeccion}>
                        <Grid container>
                            <Grid item xs={8}>
                                <Typography variant="h4" color={"primary.main"} fontWeight={"bold"}>
                                    {seccion.titulo}
                                </Typography>
                            </Grid>
                            <Grid item xs={4} container justifyContent="flex-end">
                                <Button
                                    variant="outlined"
                                    color="error"
                                    sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1rem", mr: 1 }}
                                    onClick={() => handleOpenEliminarSeccion(indexSeccion)}
                                >
                                    Eliminar Sección
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1rem" }}
                                    onClick={() => handleOpenSectionEditDialog(indexSeccion)}
                                >
                                    Editar Sección
                                </Button>
                            </Grid>
                        </Grid>

                        {seccion.campos.map((campo, index) => (
                            <Box sx={{ pl: 2, pr: 2, mb: 2 }} key={index}>
                                <Grid container alignItems="center" justifyContent="space-between" borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, py: 1 }}>
                                    <Grid item xs={4}>
                                        <Typography
                                            variant="h5"
                                            color="#000000"
                                            sx={{ fontFamily: "Segoe UI", fontWeight: "bold" }}
                                        >
                                            {campo.titulo}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4} container>
                                        <Typography variant="h5" color={"#000000"} sx={{
                                            fontFamily: "Segoe UI",
                                            fontStyle: "italic",
                                            color: campo.tipo === "Booleano" ? (campo.contenido ? "green" : "red") : undefined
                                        }}>
                                            {(() => {
                                                if (campo.tipo === "Texto") {
                                                    return campo.contenido;
                                                } else if (campo.tipo === "Numerico") {
                                                    return campo.contenido;
                                                } else if (campo.tipo === "Booleano") {
                                                    return campo.contenido ? "Sí" : "No";
                                                }
                                            })()}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4} container justifyContent={"flex-end"}>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1rem", mr: 1 }}
                                            onClick={() => handleEliminarCampoDialog(index, indexSeccion)}
                                        >
                                            Eliminar Campo
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1rem" }}
                                            onClick={() => handleOpenEditDialog(campo, seccion, indexSeccion)}
                                        >
                                            Editar Campo
                                        </Button>
                                    </Grid>
                                </Grid>
                                {(campo.subCampos && (campo.subCampos.length > 0)) && (
                                    <Grid item xs={12}>
                                        <Box sx={{ pl: 4, pr: 4 }}>
                                            {campo.subCampos.map((subCampos, index) => (
                                                <Grid container alignItems="center" justifyContent="space-between" borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, mb: 1, py: 1 }} key={index}>
                                                    <Grid item xs={6}>
                                                        <Typography variant="h6" color={"#000000"} sx={{ fontFamily: "Segoe UI", fontWeight: "normal" }}>
                                                            {subCampos.titulo}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6} container>
                                                        <Typography variant="h6" color={"#000000"} sx={{
                                                            fontFamily: "Segoe UI",
                                                            fontStyle: "italic",
                                                            fontWeight: "normal",
                                                            color: subCampos.tipo === "Booleano" ? (subCampos.contenido ? "green" : "red") : undefined
                                                        }}>
                                                            {(() => {
                                                                if (subCampos.tipo === "Texto") {
                                                                    return subCampos.contenido;
                                                                } else if (subCampos.tipo === "Numerico") {
                                                                    return subCampos.contenido;
                                                                } else if (subCampos.tipo === "Booleano") {
                                                                    return subCampos.contenido ? "Sí" : "No";
                                                                }
                                                            })()}
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
                                onClick={() => handleOpenEditDialog(null, seccion, indexSeccion)}
                            >
                                Agregar Campo
                            </Button>
                        </Grid>
                    </Paper>
                ))}
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1.5rem", my: 2
                    }}
                    onClick={() => setOpenSectionDialog(true)}
                >
                    Agregar Sección
                </Button>
                <NavbarEvidencia
                    evidencias={evidencias}
                />
            </Container>

            {/* Diálogo de edición de campo */}
            <Dialog open={openDialog} onClose={handleCloseEditDialog} maxWidth="lg" fullWidth>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={6} container direction="column" sx={{ height: '70vh', overflowY: 'auto' }}>
                            {/* Campo */}
                            {editedField && (
                                <>
                                    <Grid container>
                                        <Typography variant="h5" color="primary" fontWeight="bold">
                                            {isAdding ? "Agregar Campo" : "Editar Campo"}
                                        </Typography>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Título del Campo"
                                                name="titulo"
                                                variant="outlined"
                                                fullWidth
                                                margin="normal"
                                                value={editedField.titulo}
                                                onChange={handleFieldChange}
                                                sx={{ width: "99%" }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel>Tipo de Dato</InputLabel>
                                                <Select
                                                    label="Tipo de Dato"
                                                    name="tipo"
                                                    value={editedField.tipo}
                                                    sx={{ width: "99%" }}
                                                    onChange={(event) => {
                                                        const newCampo = { ...editedField };
                                                        if (newCampo.tipo === "Booleano") {
                                                            newCampo.contenido = "";
                                                        }
                                                        if ((newCampo.tipo === "Texto" || newCampo.tipo === "Numerico") && event.target.value === "Booleano") {
                                                            newCampo.contenido = true;
                                                        }
                                                        newCampo.tipo = event.target.value;
                                                        setEditedField({ ...editedField, tipo: event.target.value, contenido: newCampo.contenido });
                                                    }}
                                                >
                                                    <MenuItem value="Texto">Texto</MenuItem>
                                                    <MenuItem value="Numerico">Número</MenuItem>
                                                    <MenuItem value="Booleano">Booleano</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            {editedField.tipo === "Booleano" ? (
                                                <FormControl fullWidth margin="normal">
                                                    <InputLabel>Valor</InputLabel>
                                                    <Select
                                                        label="Valor"
                                                        name="contenido"
                                                        variant="outlined"
                                                        fullWidth
                                                        margin="normal"
                                                        value={editedField.contenido}
                                                        onChange={handleFieldChange}
                                                        sx={{ width: "99%" }}
                                                    >
                                                        <MenuItem value={true}>Sí</MenuItem>
                                                        <MenuItem value={false}>No</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                <TextField
                                                    label="Valor"
                                                    name="contenido"
                                                    variant="outlined"
                                                    fullWidth
                                                    margin="normal"
                                                    sx={{ width: "99%" }}
                                                    value={editedField.contenido}
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
                                            {(editedField.subCampos != null) && editedField.subCampos.map((subCampo, index) => (
                                                <Grid container key={index} sx={{ mb: 1, p: 2 }} borderBottom={1} borderColor={"secondary.main"}>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            label="Título del Subcampo"
                                                            name={`subCampos-titulo-${index}`}
                                                            variant="outlined"
                                                            fullWidth
                                                            margin="normal"
                                                            value={subCampo.titulo}
                                                            onChange={(event) => {
                                                                const newSubcampos = [...editedField.subCampos];
                                                                newSubcampos[index].titulo = event.target.value;
                                                                setEditedField({ ...editedField, subCampos: newSubcampos });
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <FormControl fullWidth margin="normal">
                                                            <InputLabel>Tipo de Dato</InputLabel>
                                                            <Select
                                                                label="Tipo de Dato"
                                                                name={`subCampos-tipo-${index}`}
                                                                value={subCampo.tipo}
                                                                onChange={(event) => {
                                                                    const newSubcampos = [...editedField.subCampos];
                                                                    if (newSubcampos[index].tipo === "Booleano") {
                                                                        newSubcampos[index].contenido = "";
                                                                    }
                                                                    newSubcampos[index].tipo = event.target.value;
                                                                    setEditedField({ ...editedField, subCampos: newSubcampos });
                                                                }}
                                                            >
                                                                <MenuItem value="Texto">Texto</MenuItem>
                                                                <MenuItem value="Numerico">Número</MenuItem>
                                                                <MenuItem value="Booleano">Booleano</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        {subCampo.tipo === "Booleano" ? (
                                                            <FormControl fullWidth margin="normal">
                                                                <InputLabel>Valor del Subcampo</InputLabel>
                                                                <Select
                                                                    label="Valor del Subcampo"
                                                                    name={`subCampos-contenido-${index}`}
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    margin="normal"
                                                                    value={subCampo.contenido}
                                                                    onChange={(event) => {
                                                                        const newSubcampos = [...editedField.subCampos];
                                                                        newSubcampos[index].contenido = event.target.value;
                                                                        setEditedField({ ...editedField, subCampos: newSubcampos });
                                                                    }}
                                                                >
                                                                    <MenuItem value={true}>Sí</MenuItem>
                                                                    <MenuItem value={false}>No</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        ) : (
                                                            <TextField
                                                                label="Valor del Subcampo"
                                                                name={`subCampos-contenido-${index}`}
                                                                variant="outlined"
                                                                fullWidth
                                                                margin="normal"
                                                                value={subCampo.contenido}
                                                                onChange={(event) => {
                                                                    const newSubcampos = [...editedField.subCampos];
                                                                    newSubcampos[index].contenido = event.target.value;
                                                                    setEditedField({ ...editedField, subCampos: newSubcampos });
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
                                            <Button color="cuaternary"
                                                variant="text"
                                                onClick={() => handleAddSubcampo()}
                                                startIcon={<AddCircleOutlineOutlinedIcon />}
                                            >
                                                Agregar Subcampo
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                        <Grid item xs={6} container direction="column" sx={{ px: 2, height: "70vh" }}>
                            <Grid item xs={6} sx={{ overflowY: 'auto', px: 2 }}>
                                <Grid item xs={12}>
                                    <Typography variant="h5" color="primary" fontWeight="bold">
                                        Gestión de Evidencia
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                                        Evidencias del Reporte
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Buscar Evidencias"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                </Grid>
                                {filteredEvidencia && (
                                    <>
                                        {filteredEvidencia.map((evidencia, index) => (
                                            <Box key={index} sx={{ mt: 2, width: '100%' }}>
                                                <Grid container borderBottom={2} borderColor={"secondary.main"} sx={{ py: 1 }}>
                                                    <Grid item xs={3}>
                                                        <Typography
                                                            variant="body1"
                                                            color="#000000"
                                                            sx={{ fontFamily: "Segoe UI", fontWeight: "bold" }}
                                                        >
                                                            {evidencia.nombre}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Button
                                                            variant="text"
                                                            sx={{
                                                                fontFamily: "Segoe UI",
                                                                fontStyle: "italic",
                                                                fontSize: "1rem",
                                                                textTransform: "none",
                                                                fontWeight: "bold",
                                                                color: "primary.main",
                                                                p: 0,
                                                            }}
                                                        >
                                                            {evidencia.tipo}
                                                        </Button>
                                                    </Grid>
                                                    <Grid item xs={6} container justifyContent="flex-end">
                                                        <Button
                                                            color="cuaternary"
                                                            variant="text"
                                                            startIcon={<AddCircleOutlineOutlinedIcon />}
                                                            onClick={() => handleAgregarEvidenciaAlCampo(evidencia)}
                                                        >
                                                            Agregar al Campo
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        ))}
                                    </>
                                )}
                            </Grid>
                            <Grid item xs={6} sx={{ overflowY: 'auto', px: 2 }}>
                                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                                    Evidencias del Campo
                                </Typography>
                                {selectedEvidencias && (
                                    <>
                                        {selectedEvidencias.map((evidencia, index) => (
                                            <Box key={index} sx={{ mt: 2, width: '100%' }}>
                                                <Grid container borderBottom={2} borderColor={"secondary.main"} sx={{ py: 1 }}>
                                                    <Grid item xs={3}>
                                                        <Typography
                                                            variant="body1"
                                                            color="#000000"
                                                            sx={{ fontFamily: "Segoe UI", fontWeight: "bold" }}
                                                        >
                                                            {evidencia.nombre}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Button
                                                            variant="text"
                                                            sx={{
                                                                fontFamily: "Segoe UI",
                                                                fontStyle: "italic",
                                                                fontSize: "1rem",
                                                                textDecoration: "underline !important",
                                                                textTransform: "none",
                                                                fontWeight: "bold",
                                                                color: "primary.main",
                                                                p: 0,
                                                            }}
                                                        >
                                                            {evidencia.tipo}
                                                        </Button>
                                                    </Grid>
                                                    <Grid item xs={6} container justifyContent="flex-end">
                                                        <Button
                                                            color="error"
                                                            variant="text"
                                                            startIcon={<RemoveCircleOutlineOutlinedIcon />}
                                                            onClick={() => handleRemoverEvidenciaDelCampo(evidencia)}
                                                        >
                                                            Remover del Campo
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        ))}
                                    </>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ position: 'sticky', bottom: 0, backgroundColor: 'white', zIndex: 1000 }}>
                    <Collapse in={alerta}>
                        <Alert severity="error" onClose={handleCloseAlert}>
                            {alertaTexto}
                        </Alert>
                    </Collapse>
                    <Button onClick={handleCloseEditDialog} color="secondary">Descartar</Button>
                    <Button onClick={handleSaveField} color="primary">Guardar</Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo para editar el titulo de la sección */}
            <Dialog open={openSectionEditDialog} onClose={() => handleCloseSectionEditDialog()} maxWidth="md" fullWidth>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 1 }}>Editar Sección</Typography>
                        </Grid>
                        <Grid item xs={4} container justifyContent="flex-end" sx={{ mb: 2 }}>
                            <IconButton onClick={() => setOpenSectionEditDialog(false)} disableRipple><CloseIcon /></IconButton>
                        </Grid>
                        <Grid item xs={12} container>
                            <Typography variant="body1">Introduzca el título de la sección:</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Título de la Sección"
                                variant="outlined"
                                fullWidth
                                value={editedSection.titulo}
                                onChange={(event) => setEditedSection({ ...editedSection, titulo: event.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid container>
                        <Grid item xs={12} container justifyContent="flex-end">
                            <Button color="secondary" variant="text" onClick={() => handleCloseSectionEditDialog()} >
                                Descartar
                            </Button>
                            <Button color="primary" variant="text" onClick={() => handleSaveSection(false)} >
                                Guardar
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/* Diálogo para editar el titulo de la categoría */}
            <Dialog open={openCategoryEditDialog} onClose={() => setOpenCategoryEditDialog(false)} maxWidth="md" fullWidth>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 1 }}>Editar Categoría</Typography>
                        </Grid>
                        <Grid item xs={4} container justifyContent="flex-end" sx={{ mb: 2 }}>
                            <IconButton onClick={() => setOpenCategoryEditDialog(false)} disableRipple><CloseIcon /></IconButton>
                        </Grid>
                        <Grid item xs={12} container>
                            <Typography variant="body1">Introduzca el título de la categoría:</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Título de la Categoría"
                                variant="outlined"
                                fullWidth
                                value={tituloIngresado}
                                onChange={(event) => setTituloIngresado(event.target.value)}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid container>
                        <Grid item xs={12} container justifyContent="flex-end">
                            <Button color="secondary" variant="text" onClick={() => setOpenCategoryEditDialog(false)} >
                                Descartar
                            </Button>
                            <Button color="primary" variant="text" onClick={() => handleEditCategory()} >
                                Guardar
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/* Diálogo para eliminar categoría */}
            <Dialog open={openEliminarCategoriaDialog} onClose={() => setOpenEliminarCategoriaDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 1 }}>Eliminar Campo</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">¿Está seguro de que desea eliminar la categoría "{categorias[categoriaActualIndex]}"?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" variant="text" onClick={() => setOpenEliminarCategoriaDialog(false)} >
                        Cancelar
                    </Button>
                    <Button color="error" variant="text" onClick={() => handleEliminarCategoria()} >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo para eliminar sección */}
            <Dialog open={openEliminarSeccionDialog} onClose={() => setOpenEliminarSeccionDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 1 }}>Eliminar Sección</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">¿Está seguro de que desea eliminar la sección "{secciones.length > 0 ? (secciones[seccionActualIndex] ? secciones[seccionActualIndex].titulo : '') : ''}"?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" variant="text" onClick={() => {
                        setOpenEliminarSeccionDialog(false)
                    }}>
                        Cancelar
                    </Button>
                    <Button color="error" variant="text" onClick={() => handleEliminarSeccion()} >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo para agregar sección */}
            <Dialog open={openSectionDialog} onClose={() => setOpenSectionDialog(false)} maxWidth="md" fullWidth>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 1 }}>Agregar Sección</Typography>
                        </Grid>
                        <Grid item xs={4} container justifyContent="flex-end" sx={{ mb: 2 }}>
                            <IconButton onClick={() => setOpenSectionDialog(false)} disableRipple><CloseIcon /></IconButton>
                        </Grid>
                        <Grid item xs={12} container>
                            <Typography variant="body1">Introduzca el título de la sección:</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Título de la Sección"
                                variant="outlined"
                                fullWidth
                                value={editedSection.titulo}
                                onChange={(event) => setEditedSection({ ...editedSection, titulo: event.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid container>
                        <Grid item xs={12} container justifyContent="flex-end">
                            <Button color="secondary" variant="text" onClick={() => setOpenSectionDialog(false)} >
                                Cancelar
                            </Button>
                            <Button color="primary" variant="text" onClick={() => handleSaveSection(true)} >
                                Agregar
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/* Diálogo para eliminar campo */}
            <Dialog open={openEliminarCampoDialog} onClose={handleCerrarEliminarCampoDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 1 }}>Eliminar Campo</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        ¿Está seguro de que desea eliminar el campo "{secciones[seccionActualIndex] ? secciones[seccionActualIndex].titulo : ''}"?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" variant="text" onClick={handleCerrarEliminarCampoDialog} >
                        Cancelar
                    </Button>
                    <Button color="error" variant="text" onClick={() => handleEliminarCampo()} >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Reporte;