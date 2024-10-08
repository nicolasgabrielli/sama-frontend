import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { Alert, Box, Button, Checkbox, Collapse, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Paper, Select, TextField, Tooltip, Typography } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { es } from 'date-fns/locale/es';
import Loading from './Loading';
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import reporteService from "../services/ReporteService";
import NavbarReporte from "./NavbarReporte";
import NavbarEvidencia from './NavbarEvidencia';
import Tabla from './Tabla';
import VerTabla from './VerTabla';
import usuarioService from '../services/UsuarioService';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function Reporte() {
    // ------------------------ BLOQUE DE CARGA DE DATOS DEL USUARIO ------------------------

    // -------------------------------- ESTADOS --------------------------------

    const [usuarioLogeado, setUsuarioLogeado] = useState(null);
    const rolesEditarReporte = [0, 1, 3, 4];
    const rolesEditarCampos = [0, 1, 2, 3, 4];
    const rolesAutorizarRegistros = [0, 3, 4];
    const rolesVerEvidencias = [0, 1, 2, 3, 4, 5];
    const rolesNavbarEvidencia = [0, 1, 2, 3, 4, 5];
    const rolesGestionarEvidencias = [0, 1, 2, 3, 4];
    const rolesDescargarReporte = [0, 1, 3, 4, 5];
    const rolesGuardarPlantilla = [0, 4];
    const rolesAutorizarReporte = [0, 4];

    // ------------------------ FUNCIONES DE REFRESH ------------------------

    // Función para obtener los datos del usuario logeado.
    const fetchUsuarioLogeado = useCallback(async () => {
        try {
            const usuario = await usuarioService.getUsuarioLogueado();
            setUsuarioLogeado(usuario.data);
            localStorage.setItem('userName', usuario.data.nombre);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }, []);

    // ------------------------ BLOQUE DE CARGA DE DATOS DEL REPORTE ------------------------

    // -------------------------------- ESTADOS --------------------------------

    const { idReporte } = useParams();
    const [reporte, setReporte] = useState(null);
    const [tituloReporte, setTituloReporte] = useState("");
    const [anioReporte, setAnioReporte] = useState("");
    const [categoriaActualIndex, setCategoriaActualIndex] = useState(0);
    const [seccionActualIndex, setSeccionActualIndex] = useState(0);
    const [categorias, setCategorias] = useState([]);
    const [secciones, setSecciones] = useState([]);
    const [evidencias, setEvidencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reporteAutorizado, setReporteAutorizado] = useState(false);

    // ------------------------ FUNCIONES DE REFRESH ------------------------

    const refreshReporte = async () => {
        reporteService.obtenerReporte(idReporte)
            .then(response => response.data)
            .then(data => {
                setReporte(data);
                setTituloReporte(data.titulo);
                setAnioReporte(data.anio);
                data.estado === 'Pendiente' ? setReporteAutorizado(false) : setReporteAutorizado(true);
                const categoriasObtenidas = data.categorias || [];
                setCategorias(categoriasObtenidas.map(categoria => categoria.titulo));
                if (categoriasObtenidas.length > 0) {
                    setSecciones(categoriasObtenidas[categoriaActualIndex].secciones || []);
                }
                console.log('Reporte obtenido:', data)
            })
            .catch(error => console.error('Error al obtener el reporte:', error));
    };

    const refreshEvidencia = async () => {
        reporteService.obtenerEvidencias(idReporte)
            .then(response => response.data)
            .then(data => {
                setEvidencias(data);
            })
            .catch(error => console.error('Error al obtener las evidencias:', error));
    };

    // Función para obtener los datos del reporte y las evidencias de la base de datos
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            await fetchUsuarioLogeado();
            await refreshReporte();
            await refreshEvidencia();
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // ------------------------ BLOQUE DE VISUALIZACIÓN ------------------------

    // ------------------------ ESTADOS ------------------------

    const [openDialog, setOpenDialog] = useState(false);
    const [openSectionDialog, setOpenSectionDialog] = useState(false);
    const [openSectionEditDialog, setOpenSectionEditDialog] = useState(false);
    const [openCategoryEditDialog, setOpenCategoryEditDialog] = useState(false);
    const [editedField, setEditedField] = useState({ titulo: "", contenido: "", tipo: "Texto", subCampos: [], porcentaje: false });
    const [currentField, setCurrentField] = useState({ titulo: "", contenido: "", tipo: "Texto", subCampos: [] });
    const [alerta, setAlerta] = useState(false);
    const [alertaTexto, setAlertaTexto] = useState("");
    const [isAdding, setIsAdding] = useState(true);
    const [editedSection, setEditedSection] = useState({ titulo: "" });
    const [openEliminarCampoDialog, setOpenEliminarCampoDialog] = useState(false);
    const [tituloIngresado, setTituloIngresado] = useState("");
    const [openEliminarCategoriaDialog, setOpenEliminarCategoriaDialog] = useState(false);
    const [openEliminarSeccionDialog, setOpenEliminarSeccionDialog] = useState(false);
    const [campoActualIndex, setCampoActualIndex] = useState(0);
    const [subCampoActualIndex, setSubCampoActualIndex] = useState(0);
    const [filteredEvidencia, setFilteredEvidencia] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEvidencias, setSelectedEvidencias] = useState([]);
    const [openVerTablaDialog, setOpenVerTablaDialog] = useState(false);
    const [csvData, setCsvData] = useState('');
    const [openTableDialog, setOpenTableDialog] = useState(false);
    const [openAutorizarCampoDialog, setOpenAutorizarCampoDialog] = useState(false);
    const [openEvidenciaDialog, setOpenEvidenciaDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);    // Modo de edición de estructura.

    // ------------------------ FUNCIONES ------------------------

    // Función para manejar el cambio de categoría.
    const handleCategoriaChange = (index) => {
        setSecciones(reporte.categorias[index].secciones || []);
        setCategoriaActualIndex(index);
    };

    // Función para abrir el diálogo de edición de la tabla.
    const handleOpenTableDialog = (csv, subCampoIndex) => {
        setSubCampoActualIndex(subCampoIndex);
        setCsvData(csv);
        setOpenTableDialog(true);
    };

    // Función para cerrar el diálogo de edición de la tabla.
    const handleCloseTableDialog = () => {
        setOpenTableDialog(false);
    };

    // Función para guardar la tabla editada.
    const handleSaveTable = (csvData) => {
        setCsvData(csvData); // Actualizar el estado de la tabla.
        if (subCampoActualIndex === -1) { // Si no se especifica un subcampo, se edita el campo principal.
            setEditedField({ ...editedField, contenido: csvData });
            console.log(csvData);
        } else { // Si se especifica un subcampo, se edita el subcampo correspondiente.
            const newSubCampos = [...editedField.subCampos];
            newSubCampos[subCampoActualIndex].contenido = csvData;
            setEditedField({ ...editedField, subCampos: newSubCampos });
        }
        handleCloseTableDialog();
    };

    // Función para manejar la búsqueda de evidencias.
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        refreshFilteredEvidencia(event.target.value, selectedEvidencias);
    };

    // Función para agregar una evidencia al campo.
    const handleAgregarEvidenciaAlCampo = (evidencia) => {
        // Se evita agregar evidencias duplicadas.
        if (!selectedEvidencias.some(selectedEvidencia => selectedEvidencia.id === evidencia.id)) {
            selectedEvidencias.push(evidencia);
        }
        refreshFilteredEvidencia(searchTerm, selectedEvidencias);
        // Ordenar por orden alfabético y numérico.
        selectedEvidencias.sort((a, b) => {
            // Función de comparación personalizada.
            const regex = /\d+/; // Expresión regular para encontrar números.

            // Extraer los números de los nombres de las evidencias.
            const numA = parseInt(a.nombre.match(regex)?.[0]) || 0;
            const numB = parseInt(b.nombre.match(regex)?.[0]) || 0;

            // Comparar los números como cadenas para tener en cuenta la longitud.
            const strNumA = numA.toString();
            const strNumB = numB.toString();

            if (strNumA.length !== strNumB.length) {
                return strNumA.length - strNumB.length; // Ordenar por longitud ascendente.
            } else {
                return strNumA.localeCompare(strNumB); // Ordenar como cadenas.
            }
        });
    };

    // Función para remover una evidencia del campo.
    const handleRemoverEvidenciaDelCampo = (evidencia) => {
        // Se remueve la evidencia de las evidencias seleccionadas.
        if (selectedEvidencias.some(selectedEvidencia => selectedEvidencia.id === evidencia.id)) {
            selectedEvidencias.splice(selectedEvidencias.indexOf(evidencia), 1);
        }
        refreshFilteredEvidencia(searchTerm, selectedEvidencias);
        // Ordenar por orden alfabético y numérico.
        selectedEvidencias.sort((a, b) => {
            // Función de comparación personalizada.
            const regex = /\d+/; // Expresión regular para encontrar números.

            // Extraer los números de los nombres de las evidencias
            const numA = parseInt(a.nombre.match(regex)?.[0]) || 0;
            const numB = parseInt(b.nombre.match(regex)?.[0]) || 0;

            // Comparar los números como cadenas para tener en cuenta la longitud.
            const strNumA = numA.toString();
            const strNumB = numB.toString();

            if (strNumA.length !== strNumB.length) {
                return strNumA.length - strNumB.length; // Ordenar por longitud ascendente.
            } else {
                return strNumA.localeCompare(strNumB); // Ordenar como cadenas.
            }
        });

    };

    // Función para refrescar las evidencias filtradas.
    const refreshFilteredEvidencia = (searchTermParam = searchTerm, selectedEvidenciasParam = selectedEvidencias) => {
        // Se filtran las evidencias que no están seleccionadas.
        const filtered = evidencias.filter(evidencia => {
            const searchTermMatch = evidencia.nombre.toLowerCase().includes(searchTermParam.toLowerCase()) ||
                evidencia.tipo.toLowerCase().includes(searchTermParam.toLowerCase()) ||
                searchTermParam === "";

            const notSelected = !selectedEvidenciasParam.some(selectedEvidencia => selectedEvidencia.id === evidencia.id);

            return searchTermMatch && notSelected;
        });


        // Ordenar por orden alfabético y numérico.
        filtered.sort((a, b) => {
            // Función de comparación personalizada.
            const regex = /\d+/; // Expresión regular para encontrar números.

            // Extraer los números de los nombres de las evidencias
            const numA = parseInt(a.nombre.match(regex)?.[0]) || 0;
            const numB = parseInt(b.nombre.match(regex)?.[0]) || 0;

            // Comparar los números como cadenas para tener en cuenta la longitud.
            const strNumA = numA.toString();
            const strNumB = numB.toString();

            if (strNumA.length !== strNumB.length) {
                return strNumA.length - strNumB.length; // Ordenar por longitud ascendente.
            } else {
                return strNumA.localeCompare(strNumB); // Ordenar como cadenas.
            }
        });

        setFilteredEvidencia(filtered);
    };

    // Función para refrescar las evidencias que contiene el campo.
    const refreshEvidenciaCampo = (campo) => {
        if (campo) {
            setSelectedEvidencias(campo.evidencias || []);
            refreshFilteredEvidencia(searchTerm, campo.evidencias || []);
        } else {
            setSelectedEvidencias([]);
            refreshFilteredEvidencia(searchTerm, []);
        }
    };

    // Función para convertir una dirección en una URL válida. 
    // Ejemplo: 'www.google.com' -> 'https://www.google.com/'
    function formatUrl(address) {
        // Elimina espacios en blanco al inicio y al final de la cadena.
        address = address.trim();

        if (!address.startsWith('http://') && !address.startsWith('https://')) { // Si no empieza con 'http://' o 'https://'
            address = 'https://' + address;
        }

        if (!address.endsWith('/')) { // Si no termina con '/'
            address = address + '/';
        }

        return address;
    }

    // Función para acceder a una evidencia.
    const accederEvidencia = async (evidencia) => {
        try {
            if (evidencia.tipo.toLowerCase() === 'archivo') {
                let url = await reporteService.obtenerUrlS3(evidencia.id).then(response => response.data);  // Obtener la URL del servicio S3.
                if (url) {
                    window.open(url, '_blank'); // Abrir la URL en una nueva pestaña.
                } else {
                    console.error('La URL obtenida del servicio S3 es nula o no válida.');  // Mostrar un mensaje de error.
                }
            } else {
                window.open(formatUrl(evidencia.url), '_blank');    // Abrir la URL en una nueva pestaña.
            }
        } catch (error) {
            console.error('Error al acceder a la evidencia:', error);   // Mostrar un mensaje de error.
        }
    }

    // Función para abrir el pop up de editar campo.
    const handleOpenEditDialog = (campo, section = null, indexSeccion, indexCampo) => {
        setCurrentField(campo);                 // Guardar el campo actual.
        setEditedField({
            ...campo,
            tipo: campo ? campo.tipo : "texto", // Si el campo es nulo, el tipo es "Texto".
            subCampos: campo ? JSON.parse(JSON.stringify(campo.subCampos || [])) : [] // Clonar correctamente los subcampos.
        });
        setIsAdding(!campo);                    // Si el campo es nulo, se está agregando un campo nuevo.
        refreshEvidenciaCampo(campo);           // Refrescar las evidencias del campo.
        setSeccionActualIndex(indexSeccion);    // Guardar el índice de la sección actual.
        setCampoActualIndex(indexCampo);        // Guardar el índice del campo actual.
        setOpenDialog(true);                    // Abrir el pop up de editar campo.
    };

    // Cerrar el pop up de editar campo.
    const handleCloseEditDialog = () => {
        setOpenDialog(false);       // Cerrar el pop up de editar campo.
        setEditedField(null);       // Limpiar el campo editado.
        setIsAdding(false);         // No se está agregando un campo nuevo.
        refreshReporte();           // Refrescar el reporte.
        refreshEvidencia();         // Refrescar las evidencias.
        refreshFilteredEvidencia(); // Refrescar las evidencias filtradas.
    };

    // Abrir popup de eliminar campo.
    const handleEliminarCampoDialog = (campoIndex, indexSeccion) => {
        setCampoActualIndex(campoIndex);        // Guardar el índice del campo actual.
        setSeccionActualIndex(indexSeccion);    // Guardar el índice de la sección actual.
        setOpenEliminarCampoDialog(true);       // Abrir el pop up de eliminar campo.
    };

    // Cerrar popup de eliminar campo.
    const handleCerrarEliminarCampoDialog = () => {
        setOpenEliminarCampoDialog(false);      // Cerrar el pop up de eliminar campo.
        handleCloseEditDialog();                // Cerrar el pop up de editar campo.
    };

    // Abrir popup de editar categoría.
    const handleOpenCategoryEditDialog = () => {
        setOpenCategoryEditDialog(true);                        // Abrir el pop up de editar categoría.
        setTituloIngresado(categorias[categoriaActualIndex]);   // Guardar el título de la categoría actual.
    }

    // Abrir popup de editar sección.
    const handleOpenSectionEditDialog = (seccionIndex) => {
        setOpenSectionEditDialog(true);                                 // Abrir el pop up de editar sección.
        setSeccionActualIndex(seccionIndex)                             // Guardar el índice de la sección actual.
        setEditedSection({ titulo: secciones[seccionIndex].titulo });   // Guardar el título de la sección actual.
    };

    // Cerrar popup de editar sección.
    const handleCloseSectionEditDialog = () => {
        setOpenSectionEditDialog(false);    // Cerrar el pop up de editar sección.
        setEditedSection({ titulo: "" });   // Limpiar el título de la sección editada.
    };

    // Abrir alerta.
    const handleOpenAlert = (texto) => {
        setAlerta(true);        // Abrir la alerta.
        setAlertaTexto(texto);  // Asignar el texto de la alerta.
    };

    // Cerrar alerta.
    const handleCloseAlert = () => {
        setAlerta(false);
    };

    // Ejecutar eliminación de categoría.
    const handleEliminarCategoria = async () => {
        // Se crea un objeto con las coordenadas de la categoría a eliminar.
        let coordenadas = {
            indexCategoria: categoriaActualIndex    // Coordenada de la categoría a eliminar.
        }
        await reporteService.eliminarContenido(idReporte, coordenadas);         // Se elimina la categoría del reporte.
        setCategorias(categorias.filter((categoria, index) => index !== categoriaActualIndex)); // Se elimina la categoría de la lista de categorías.
        setCategoriaActualIndex(0);                                            // Se reinicia el índice de la categoría actual.
        await fetchData();                              // Se actualizan los datos del reporte.
        setOpenEliminarCategoriaDialog(false);          // Se cierra el pop up de eliminar categoría.
        setOpenCategoryEditDialog(false);               // Se cierra el pop up de editar categoría.
    };

    // Abrir popup de eliminar sección.
    const handleOpenEliminarSeccion = () => {
        setOpenEliminarSeccionDialog(true);
    };

    // Cerrar popup de eliminar sección.
    const handleCloseEliminarSeccion = () => {
        setOpenEliminarSeccionDialog(false);
        handleCloseSectionEditDialog();
    }

    // Función para eliminar una sección.
    const handleEliminarSeccion = async () => {
        let coordenadas = {
            indexCategoria: categoriaActualIndex,
            indexSeccion: seccionActualIndex
        }
        await reporteService.eliminarContenido(idReporte, coordenadas);
        refreshReporte();
        setOpenEliminarSeccionDialog(false);
        handleCloseEliminarSeccion();
    };

    // Función para eliminar un campo.
    const handleEliminarCampo = async () => {
        if (campoActualIndex !== -1) {
            let coordenadas = {
                indexCategoria: categoriaActualIndex,
                indexSeccion: seccionActualIndex,
                indexCampo: campoActualIndex,
            }
            await reporteService.eliminarContenido(idReporte, coordenadas);
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
        await fetchData();
        setOpenEliminarCampoDialog(false);
        handleCerrarEliminarCampoDialog();
        handleCloseEditDialog();
    };

    // Función para guardar el campo editado o agregado.
    const handleSaveField = async () => {
        // Validación Campo
        const campo = editedField;
        const subCampos = campo.subCampos || [];

        // Se crea un objeto con los datos del campo editado.
        const campoEditado = {
            titulo: campo.titulo,
            contenido: campo.contenido,
            tipo: campo.tipo,
            porcentaje: campo.porcentaje || false,
            subCampos: subCampos,
            evidencias: selectedEvidencias, // Se envían solo los IDs de las evidencias.
            autorizado: false
        };


        let campoIndex = 0;                                             // Se define el índice del campo.
        let seccionIndex = seccionActualIndex;                          // Se define el índice de la sección.
        if (isAdding) {                                                 // Si se está agregando un campo nuevo.
            campoIndex = secciones[seccionActualIndex].campos.length;   // Se obtiene el índice del nuevo campo. (Ocupa la última posición porque es un campo nuevo)
            let newReporte = {                                          // Se crea un objeto con los datos del nuevo campo.
                coordenadas: {
                    indexCategoria: categoriaActualIndex,
                    indexSeccion: seccionIndex,
                    indexCampo: campoIndex
                },
                nuevoTituloCategoria: categorias[categoriaActualIndex],
                nuevoTituloSeccion: secciones[seccionIndex].titulo,
                nuevoCampo: campoEditado
            }
            setSecciones(secciones.map((seccion, index) => {            // Se actualiza la lista de secciones.
                if (index === seccionIndex) {
                    return {
                        ...seccion,
                        campos: [...seccion.campos, campoEditado]
                    };
                }
                return seccion;
            }));
            await reporteService.actualizarReporte(newReporte, idReporte);  // Se actualiza el reporte en la base de datos.
            fetchData();                                                    // Se actualizan los datos del reporte.
            refreshFilteredEvidencia();                                     // Se actualizan las evidencias filtradas.
        }

        else {                                                              // Si se está editando un campo existente.
            campoIndex = secciones[seccionIndex].campos.findIndex(c => c === currentField); // Se obtiene el índice del campo a editar.
            if (campoIndex !== -1) {                                                // Si se encontró el campo.
                let newReporte = {                                                  // Se crea un objeto con los datos del campo editado.
                    coordenadas: {                                                  // Se envían las coordenadas del campo a editar.
                        indexCategoria: categoriaActualIndex,
                        indexSeccion: seccionIndex,
                        indexCampo: campoIndex,
                    },
                    nuevoTituloCategoria: categorias[categoriaActualIndex],
                    nuevoTituloSeccion: secciones[seccionIndex].titulo,
                    nuevoCampo: campoEditado
                }
                setSecciones(secciones.map((seccion, index) => {                // Se actualiza la lista de secciones.
                    if (index === seccionIndex) {
                        return {
                            ...seccion,
                            campos: seccion.campos.map((campo, index) => {
                                if (index === campoIndex) {
                                    return campoEditado;
                                }
                                return campo;
                            })
                        };
                    }
                    return seccion;
                }));
                await reporteService.actualizarReporte(newReporte, idReporte);  // Se actualiza el reporte en la base de datos.
                fetchData();                                                    // Se actualizan los datos del reporte.
                refreshFilteredEvidencia();                                     // Se actualizan las evidencias filtradas.
            }
            else {
                console.log("error al guardar campo");
            }
        }

        setOpenDialog(false);
    };

    // Función para guardar la sección editada o agregada.
    const handleSaveSection = async (agregar) => {
        // Validación de que los campos estén completos.
        const seccion = editedSection;
        if (seccion.titulo === "" || seccion.titulo === null || seccion.titulo === undefined) {
            handleOpenAlert("Por favor, complete el titulo de la sección.");
            return;
        }

        let indexSeccion = seccionActualIndex;  // Se define el índice de la sección.
        if (agregar) {                          // Si se está agregando una sección nueva.
            indexSeccion = secciones.length;    // Se obtiene el índice de la nueva sección. (Ocupa la última posición porque es una sección nueva)
        }
        const newReporte = {                    // Se crea un objeto con los datos de la sección editada o agregada.
            coordenadas: {
                indexCategoria: categoriaActualIndex,
                indexSeccion: indexSeccion,
                indexCampo: null

            },
            nuevoTituloCategoria: categorias[categoriaActualIndex],
            nuevoTituloSeccion: seccion.titulo,
            nuevoCampo: {}
        }
        setSecciones(secciones.map((seccion, index) => {    // Se actualiza la lista de secciones.
            if (index === seccionActualIndex) {
                return {
                    ...seccion,
                    titulo: seccion.titulo
                };
            }
            return seccion;
        }));
        try {
            await reporteService.actualizarReporte(newReporte, idReporte);  // Se actualiza el reporte en la base de datos.
            fetchData();                                                    // Se actualizan los datos del reporte.
        } catch (error) {
            console.error('Error al guardar la sección:', error);
        }
        setOpenSectionEditDialog(false);    // Se cierra el pop up de editar sección.
        setOpenSectionDialog(false);        // Se cierra el pop up de agregar sección.
    };

    // Función para editar el titulo de la categoría.
    const handleEditCategory = async () => {
        // Validación de que el titulo esté completo.
        if (tituloIngresado === "" || tituloIngresado === null || tituloIngresado === undefined) {
            handleOpenAlert("Por favor, complete el titulo de la categoría.");
            return;
        }

        const newReporte = {    // Se crea un objeto con los datos de la categoría editada.
            coordenadas: {
                indexCategoria: categoriaActualIndex
            },
            nuevoTituloCategoria: tituloIngresado
        }
        setCategorias(categorias.map((categoria, index) => {    // Se actualiza la lista de categorías.
            if (index === categoriaActualIndex) {
                return tituloIngresado;
            }
            return categoria;
        }));
        try {
            await reporteService.actualizarReporte(newReporte, idReporte);  // Se actualiza el reporte en la base de datos.
            fetchData();
        } catch (error) {
            console.error('Error al guardar la categoría:', error); // Mostrar un mensaje de error.
        }
        setTituloIngresado("");             // Limpiar el titulo ingresado.
        setOpenCategoryEditDialog(false);   // Cerrar el pop up de editar categoría.
    };


    // Modificar un subcampo o campo.
    const handleFieldChange = (event) => {
        const { name, value } = event.target;
    
        if (name.startsWith('subCampos')) {
            const subcampoIndex = parseInt(name.split('-')[2]);
            // Asegúrate de que subCampos esté definido y sea un array
            if (Array.isArray(editedField.subCampos) && subcampoIndex >= 0 && subcampoIndex < editedField.subCampos.length) {
                const newSubCampos = [...editedField.subCampos];
                newSubCampos[subcampoIndex] = {
                    ...newSubCampos[subcampoIndex],
                    [name.split('-')[1]]: value
                };
                setEditedField({ ...editedField, subCampos: newSubCampos });
            } else {
                console.error('Índice de subcampo inválido o subCampos no es un array');
            }
        } else {
            setEditedField((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };
    

    // Agregar un subcampo.
    const handleAddSubcampo = () => {
        const newSubcampo = { titulo: "", contenido: "", tipo: "Texto" };   // Se crea un nuevo subcampo.
        setEditedField({
            ...editedField,
            subCampos: [...(editedField.subCampos || []), newSubcampo]  // Se agrega el subcampo a la lista de subcampos.
        });
    };

    // Eliminar un subcampo.
    const handleDeleteSubcampo = (index) => {
        const newSubcampos = [...editedField.subCampos];
        newSubcampos.splice(index, 1);
        setEditedField({ ...editedField, subCampos: newSubcampos });
    }

    // Función para abrir el pop up de visualización de la tabla.
    const handleOpenVerTabla = (data) => {
        setCsvData(data);
        setOpenVerTablaDialog(true);
    };

    // Función para cerrar el pop up de visualización de la tabla.
    const handleCloseVerTabla = () => {
        setOpenVerTablaDialog(false);
    };

    // Función para abrir el pop up de visualización de la evidencia.
    const handleVisualizarEvidenciaCampo = async (indexSeccion, indexCampo) => {
        await refreshEvidencia();
        if (secciones[seccionActualIndex].campos[indexCampo].evidencias.length > 0) {
            setOpenEvidenciaDialog(true);
            refreshEvidenciaCampo(secciones[seccionActualIndex].campos[indexCampo]);
            setSeccionActualIndex(indexSeccion);
            setCampoActualIndex(indexCampo);
        }
    };

    // Función abrir el pop up de autorización de campo.
    const handleOpenAutorizarCampo = (indexCampo, indexSeccion) => {
        setCampoActualIndex(indexCampo);
        setSeccionActualIndex(indexSeccion);
        setOpenAutorizarCampoDialog(true);
    };

    // Función para autorizar el campo y cerrar el pop up.
    const handleAutorizarCampo = async () => {
        let coordenadas = {
            idUsuario: usuarioLogeado.id,
            coordenadas: {
                indexCategoria: categoriaActualIndex,
                indexSeccion: seccionActualIndex,
                indexCampo: campoActualIndex,
            },
        }
        await reporteService.autorizarCampo(idReporte, coordenadas);
        setOpenAutorizarCampoDialog(false);
        await fetchData();
    };

    // Función para activar modo de edición de estructura.
    const handleEditMode = (guardado) => {
        setEditMode((prevEditMode) => {
            const newEditMode = !prevEditMode;
            const categoriaIndex = categoriaActualIndex;

            if (!newEditMode) {
                fetchData(); // Ejecuta fetchData si se desactiva el modo de edición.
            }

            if (guardado) {
                // Obtiene el reporte y lo actualiza.
                reporteService.obtenerReporte(idReporte)
                    .then((nuevoReporte) => {
                        nuevoReporte = nuevoReporte.data;
                        nuevoReporte.categorias = nuevoReporte.categorias.map((categoria, index) => {
                            if (index === categoriaIndex) { // Solo actualiza la categoría especificada
                                return {
                                    ...categoria, // Se mantienen las demás propiedades de la categoría
                                    titulo: categorias[categoriaIndex],
                                    secciones: secciones.map((seccion) => ({
                                        titulo: seccion.titulo,
                                        campos: seccion.campos.map((campo) => ({
                                            titulo: campo.titulo,
                                            contenido: campo.contenido,
                                            tipo: campo.tipo,
                                            subCampos: campo.subCampos,
                                            evidencias: campo.evidencias,
                                            autorizado: campo.autorizado,
                                        }))
                                    }))
                                };
                            } else {
                                return categoria; // Mantén el contenido original para otras categorías
                            }
                        });

                        return reporteService.reescribirReporte(idReporte, nuevoReporte);
                    })
                    .then(() => {
                        console.log('Reporte reescrito con éxito');
                        // Una vez reescrito el reporte, se refresca el reporte con los datos subidos.
                        fetchData();
                    })
                    .catch((error) => {
                        console.error('Error al actualizar el reporte:', error);
                    });
            }

            return newEditMode;
        });
    };

    // Función para manejar el arrastre de campos.
    const handleDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return;

        const sourceSectionIndex = parseInt(source.droppableId);
        const destinationSectionIndex = parseInt(destination.droppableId);

        const sourceIndex = source.index;
        const destinationIndex = destination.index;

        const newSecciones = Array.from(secciones);
        const [movedItem] = newSecciones[sourceSectionIndex].campos.splice(sourceIndex, 1);
        newSecciones[destinationSectionIndex].campos.splice(destinationIndex, 0, movedItem);

    };

    // Función para cambiar el formato de la fecha.
    function formatearFecha(fecha, mostrarHoras) {
        const nuevaFecha = new Date(fecha);

        const dia = String(nuevaFecha.getDate()).padStart(2, '0');
        const mes = String(nuevaFecha.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
        const año = String(nuevaFecha.getFullYear()).slice(2); // Solo los últimos 2 dígitos

        if (!mostrarHoras) {
            return `${dia}/${mes}/${año}`;
        }
        else {
            const horas = String(nuevaFecha.getHours()).padStart(2, '0');
            const minutos = String(nuevaFecha.getMinutes()).padStart(2, '0');
            const segundos = String(nuevaFecha.getSeconds()).padStart(2, '0');
            return `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;
        }
    }

    // Formatea el número con separadores de miles y decimales
    const formatearNumero = (value, porcentaje) => {
        let number = value;

        // Verifica si el último carácter es '%'
        if (number.charAt(number.length - 1) === '%') {
            porcentaje = true;
            number = number.slice(0, -1); // Elimina el '%'
        }

        // Convierte el valor a un número flotante
        number = parseFloat(number.replace(',', '.'));

        // Si el valor no es un número, retorna una cadena vacía
        if (isNaN(number)) return '';

        // Formatea el número con separadores de miles y decimales
        const formattedNumber = new Intl.NumberFormat('es-ES', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 20,
        }).format(number);

        // Si es un porcentaje, añade el '%' al final
        return porcentaje ? `${formattedNumber}%` : formattedNumber;
    };


    return (
        <>
            {loading && (
                <>
                    <Loading />
                </>
            )}

            {!loading && (
                <>
                    <NavbarReporte
                        useSectionMode={true}
                        categorias={categorias}
                        categoriaActualIndex={categoriaActualIndex}
                        onCategoriaChange={handleCategoriaChange}
                        tituloReporte={tituloReporte}
                        anioReporte={anioReporte}
                        refreshReporte={refreshReporte}
                        usuarioLogeado={usuarioLogeado}
                        rolesEditarReporte={rolesEditarReporte}
                    />
                    <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', minWidth: '80vw', pb: '100px' }}>
                        <Paper sx={{ mt: 2, p: 2, flexGrow: 1 }}>
                            <Grid container justifyContent="space-between" alignItems="center">
                                <Grid item xs={8}>
                                    <Typography variant="h4" color={"primary.main"} fontWeight={"bold"}>
                                        {categorias[categoriaActualIndex]}
                                    </Typography>
                                </Grid>
                                {usuarioLogeado && rolesEditarReporte.includes(parseInt(usuarioLogeado.rol)) && (
                                    <Grid item xs={4} container justifyContent="flex-end">
                                        <Button
                                            variant="text"
                                            color="primary"
                                            sx={{
                                                textTransform: "none",
                                                fontWeight: "bold",
                                                fontStyle: "italic",
                                                fontSize: "1.1rem",
                                                width: "200px",
                                                transition: "transform 0.2s",
                                                '&:hover': {
                                                    transform: "scale(1.02)",
                                                },
                                            }}
                                            onClick={handleOpenCategoryEditDialog}
                                            endIcon={<EditIcon style={{ fontSize: "1.1rem" }} />}
                                        >
                                            Editar Categoría
                                        </Button>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>
                        <DragDropContext onDragEnd={handleDragEnd}>
                            {secciones.map((seccion, indexSeccion) => (
                                <Droppable key={indexSeccion} droppableId={`${indexSeccion}`} isDropDisabled={!editMode}>
                                    {(provided) => (
                                        <Paper sx={{ mt: 2, p: 2, flexGrow: 1 }} ref={provided.innerRef} {...provided.droppableProps}>
                                            <Grid container>
                                                <Grid item xs={6}>
                                                    <Typography variant="h4" color={"primary.main"} fontWeight={"bold"}>
                                                        {seccion.titulo}
                                                        {usuarioLogeado && rolesEditarReporte.includes(parseInt(usuarioLogeado.rol)) && (
                                                            <Tooltip title="Editar Sección" placement="bottom" arrow>
                                                                <span>
                                                                    <IconButton
                                                                        variant="outlined"
                                                                        onClick={() => handleOpenSectionEditDialog(indexSeccion)}
                                                                        disabled={editMode}
                                                                        sx={{
                                                                            ml: 1,
                                                                            transition: "transform 0.2s",
                                                                            '&:hover': {
                                                                                transform: "scale(1.1) translateY(-2px)",
                                                                            },
                                                                        }}
                                                                    >
                                                                        <EditIcon color={editMode ? 'secondary' : 'primary'} />
                                                                    </IconButton>
                                                                </span>
                                                            </Tooltip>
                                                        )}
                                                        {usuarioLogeado && rolesEditarReporte.includes(parseInt(usuarioLogeado.rol)) && !editMode && (
                                                            <Tooltip title="Mover Campos" placement="bottom" arrow>
                                                                <IconButton
                                                                    variant="outlined"
                                                                    onClick={() => handleEditMode(false)}
                                                                    sx={{
                                                                        transition: "transform 0.2s",
                                                                        '&:hover': {
                                                                            transform: "scale(1.1) translateY(-2px)",
                                                                        },
                                                                    }}
                                                                >
                                                                    <ImportExportIcon color={editMode ? "secondary" : "primary"} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                        {editMode && (
                                                            <>
                                                                <Tooltip title="Descartar Cambios" placement="bottom" arrow>
                                                                    <span>
                                                                        <IconButton
                                                                            variant="outlined"
                                                                            onClick={() => handleEditMode(false)}
                                                                            sx={{
                                                                                transition: "transform 0.2s",
                                                                                '&:hover': {
                                                                                    transform: "scale(1.1) translateY(-2px)",
                                                                                },
                                                                            }}
                                                                        >
                                                                            <CloseIcon color="error" />
                                                                        </IconButton>
                                                                    </span>
                                                                </Tooltip>
                                                                <Tooltip title="Guardar Cambios" placement="bottom" arrow>
                                                                    <span>
                                                                        <IconButton
                                                                            variant="outlined"
                                                                            onClick={() => handleEditMode(true)}
                                                                            sx={{
                                                                                transition: "transform 0.2s",
                                                                                '&:hover': {
                                                                                    transform: "scale(1.1) translateY(-2px)",
                                                                                },
                                                                            }}
                                                                        >
                                                                            <CheckIcon color="cuaternary" />
                                                                        </IconButton>
                                                                    </span>
                                                                </Tooltip>
                                                            </>
                                                        )}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    {editMode && (
                                                        <Typography variant="h6" color={"secondary.main"} fontWeight={"bold"}>
                                                            Modo cambio de estructura activado. Arrastre los campos para reordenarlos.
                                                        </Typography>
                                                    )}
                                                </Grid>
                                            </Grid>

                                            {seccion.campos.map((campo, index) => (
                                                <Draggable key={index} draggableId={`${indexSeccion}-${index}`} index={index} isDragDisabled={!editMode}>
                                                    {(provided) => (
                                                        <Box sx={{ pl: 2, pr: 2, my: 2 }} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                            <Grid container alignItems="center" justifyContent="space-between" borderBottom={2} borderColor={"secondary.main"} sx={{ mx: 0, py: 1 }}>
                                                                <Grid item xs={3}>
                                                                    <Typography
                                                                        variant="h5"
                                                                        color="#000000"
                                                                        sx={{
                                                                            fontFamily: "Segoe UI",
                                                                            fontWeight: "bold",
                                                                            ml: 0.5
                                                                        }}
                                                                    >
                                                                        {campo.titulo}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={7}>
                                                                    <Typography variant="body1" color={"#000000"} sx={{
                                                                        fontFamily: "Segoe UI",
                                                                        fontStyle: "italic",
                                                                        fontSize: "1.125rem",
                                                                        color: campo.tipo === "Booleano" ? (campo.contenido ? "green" : "red") : undefined
                                                                    }}>
                                                                        {(() => {
                                                                            if (campo.tipo) {
                                                                                if (campo.tipo.toLowerCase() === "texto") {
                                                                                    return campo.contenido;
                                                                                } else if (campo.tipo.toLowerCase() === "fecha") {
                                                                                    return formatearFecha(campo.contenido, false);
                                                                                } else if (campo.tipo.toLowerCase() === "numerico") {
                                                                                    return formatearNumero(campo.contenido, campo.porcentaje ? true : false);
                                                                                } else if (campo.tipo.toLowerCase() === "booleano") {
                                                                                    return campo.contenido ? "Sí" : "No";
                                                                                } else if (campo.tipo.toLowerCase() === "tabla") {
                                                                                    return (
                                                                                        <div style={{ justifyContent: 'center' }}>
                                                                                            <Button
                                                                                                variant="text"
                                                                                                onClick={() => handleOpenVerTabla(campo.contenido)}
                                                                                                sx={{
                                                                                                    textTransform: "none",
                                                                                                    fontWeight: "bold",
                                                                                                    fontStyle: "italic",
                                                                                                    fontSize: "1.125rem",
                                                                                                    transition: "transform 0.2s",
                                                                                                    '&:hover': {
                                                                                                        transform: "scale(1.05) translateY(-2px)",
                                                                                                    },
                                                                                                }}
                                                                                                disabled={editMode}
                                                                                                startIcon={<BackupTableIcon />}
                                                                                            >
                                                                                                Ver Tabla
                                                                                            </Button>
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                            }
                                                                        })()}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={2} container justifyContent={"flex-end"}>
                                                                    {/* Botón de autorizar campo */}
                                                                    {usuarioLogeado && rolesAutorizarRegistros.includes(parseInt(usuarioLogeado.rol)) && (
                                                                        <Tooltip
                                                                            title={
                                                                                campo.autorizado === true ? (
                                                                                    <div style={{ textAlign: 'center', lineHeight: '1' }}>
                                                                                        <div>Campo autorizado por:</div>
                                                                                        <br />
                                                                                        <div>{campo.nombreAutorizador}</div>
                                                                                        <br />
                                                                                        <div>{formatearFecha(campo.fechaAutorizacion, true)}</div>
                                                                                    </div>
                                                                                ) : (
                                                                                    "Autorizar Campo"
                                                                                )
                                                                            }
                                                                            placement="bottom"
                                                                            arrow
                                                                            PopperProps={{
                                                                                style: { textAlign: 'center' }
                                                                            }}
                                                                        >
                                                                            <span>
                                                                                <IconButton
                                                                                    variant="outlined"
                                                                                    color={campo.autorizado === true ? "cuaternary" : "primary"}
                                                                                    onClick={() => handleOpenAutorizarCampo(index, indexSeccion)}
                                                                                    sx={{
                                                                                        transition: "transform 0.2s",
                                                                                        '&:hover': {
                                                                                            transform: "scale(1.1) translateY(-2px)",
                                                                                        },
                                                                                        color: campo.autorizado === true ? "cuaternary" : "primary"
                                                                                    }}
                                                                                >
                                                                                    {campo.autorizado === true ? <DoneAllIcon /> : <CheckIcon />}
                                                                                </IconButton>
                                                                            </span>
                                                                        </Tooltip>
                                                                    )}
                                                                    {usuarioLogeado && !rolesAutorizarRegistros.includes(parseInt(usuarioLogeado.rol))
                                                                        && !rolesAutorizarReporte.includes(parseInt(usuarioLogeado.rol))
                                                                        && (
                                                                            <>
                                                                                {/* Indicador de Campo Autorizado */}
                                                                                <Tooltip
                                                                                    title={campo.autorizado === true ? "Campo Autorizado" : "Campo aún no autorizado"}
                                                                                    placement="bottom"
                                                                                    arrow
                                                                                >
                                                                                    <span>
                                                                                        <IconButton
                                                                                            variant="outlined"
                                                                                            color="inherit"  // Usa 'inherit' para aplicar color personalizado
                                                                                            disabled
                                                                                            sx={{
                                                                                                color: campo.autorizado === true ? "cuaternary.main" : "secondary.main",
                                                                                                transition: "transform 0.2s",
                                                                                                '&:hover': {
                                                                                                    transform: "scale(1.1) translateY(-2px)",
                                                                                                    backgroundColor: 'transparent', // Evita el color de fondo en hover
                                                                                                },
                                                                                                '&.Mui-disabled': {
                                                                                                    color: campo.autorizado === true ? "cuaternary.main" : "secondary.main",
                                                                                                    cursor: "default",
                                                                                                    backgroundColor: 'transparent' // Asegúrate de que el fondo también se mantenga transparente
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            {campo.autorizado === true ? <DoneAllIcon /> : <CheckIcon />}
                                                                                        </IconButton>
                                                                                    </span>
                                                                                </Tooltip>
                                                                            </>
                                                                        )}

                                                                    {/* Botón de ver evidencias asociadas al campo */}
                                                                    {usuarioLogeado && rolesVerEvidencias.includes(parseInt(usuarioLogeado.rol)) && (
                                                                        <Tooltip
                                                                            title={campo.evidencias ? (campo.evidencias.length === 0 ? "No contiene evidencias" : "Visualizar Evidencias") : "No contiene evidencias"}
                                                                            placement="bottom"
                                                                            arrow
                                                                            disableInteractive
                                                                        >
                                                                            <span>
                                                                                <IconButton
                                                                                    variant="outlined"
                                                                                    color="primary"
                                                                                    onClick={() => handleVisualizarEvidenciaCampo(indexSeccion, index)}
                                                                                    disabled={(campo.evidencias ? (campo.evidencias.length === 0) : false) || editMode}
                                                                                    sx={{
                                                                                        transition: "transform 0.2s",
                                                                                        '&:hover': {
                                                                                            transform: "scale(1.1) translateY(-2px)",
                                                                                        },
                                                                                    }}
                                                                                >
                                                                                    <FindInPageIcon />
                                                                                </IconButton>
                                                                            </span>
                                                                        </Tooltip>
                                                                    )}

                                                                    {/* Botón de editar campo */}
                                                                    {campo.autorizado !== true && usuarioLogeado && rolesEditarCampos.includes(parseInt(usuarioLogeado.rol)) && (
                                                                        <Tooltip title="Editar Campo" placement="bottom" arrow>
                                                                            <span>
                                                                                <IconButton
                                                                                    variant="outlined"
                                                                                    color="primary"
                                                                                    onClick={() => handleOpenEditDialog(campo, seccion, indexSeccion, index)}
                                                                                    disabled={editMode}
                                                                                    sx={{
                                                                                        transition: "transform 0.2s",
                                                                                        '&:hover': {
                                                                                            transform: "scale(1.1) translateY(-2px)",
                                                                                        },
                                                                                    }}
                                                                                >
                                                                                    <EditIcon />
                                                                                </IconButton>
                                                                            </span>
                                                                        </Tooltip>
                                                                    )}
                                                                </Grid>
                                                            </Grid>
                                                            {(campo.subCampos && (campo.subCampos.length > 0 || campo.subCampos != null)) && (
                                                                <Grid item xs={12}>
                                                                    <Box sx={{ pl: 4, pr: 4 }}>
                                                                        {campo.subCampos.map((subCampos, subIndex) => (
                                                                            <Grid container alignItems="center" justifyContent="space-between" borderBottom={2} borderColor={"secondary.main"} sx={{ mb: 1, py: 1 }} key={subIndex}>
                                                                                <Grid item xs={3}>
                                                                                    <Typography variant="h6" color={"#000000"} sx={{ fontFamily: "Segoe UI", fontWeight: "normal" }}>
                                                                                        {subCampos.titulo}
                                                                                    </Typography>
                                                                                </Grid>
                                                                                <Grid item xs={9}>
                                                                                    <Typography variant="body1" color={"#000000"} sx={{
                                                                                        fontFamily: "Segoe UI",
                                                                                        fontStyle: "italic",
                                                                                        fontSize: "1.05rem",
                                                                                        fontWeight: "normal",
                                                                                        ml: 2,
                                                                                        color: subCampos.tipo === "Booleano" ? (subCampos.contenido ? "green" : "red") : undefined
                                                                                    }}>
                                                                                        {(() => {
                                                                                            if (subCampos.tipo) {
                                                                                                if (subCampos.tipo.toLowerCase() === "texto") {
                                                                                                    return subCampos.contenido;
                                                                                                } else if (subCampos.tipo.toLowerCase() === "fecha") {
                                                                                                    return formatearFecha(subCampos.contenido, false);
                                                                                                } else if (subCampos.tipo.toLowerCase() === "numerico") {
                                                                                                    return formatearNumero(subCampos.contenido, subCampos.porcentaje ? true : false);
                                                                                                } else if (subCampos.tipo.toLowerCase() === "booleano") {
                                                                                                    return subCampos.contenido ? "Sí" : "No";
                                                                                                } else if (subCampos.tipo.toLowerCase() === "tabla") {
                                                                                                    return (
                                                                                                        <div style={{ justifyContent: 'center' }}>
                                                                                                            <Button
                                                                                                                variant="text"
                                                                                                                onClick={() => handleOpenVerTabla(subCampos.contenido)}
                                                                                                                disabled={editMode}
                                                                                                                sx={{
                                                                                                                    textTransform: "none",
                                                                                                                    fontWeight: "bold",
                                                                                                                    fontStyle: "italic",
                                                                                                                    fontSize: "1.125rem",
                                                                                                                    transition: "transform 0.2s",
                                                                                                                    '&:hover': {
                                                                                                                        transform: "scale(1.05) translateY(-2px)",
                                                                                                                    },
                                                                                                                }}
                                                                                                                startIcon={<BackupTableIcon />}
                                                                                                            >
                                                                                                                Ver Tabla
                                                                                                            </Button>
                                                                                                        </div>
                                                                                                    );
                                                                                                }
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
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                            {/* Agregar Campo */}
                                            {usuarioLogeado && rolesEditarReporte.includes(parseInt(usuarioLogeado.rol)) && !editMode && (
                                                <Grid container justifyContent="center">
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        sx={{
                                                            textTransform: "none",
                                                            fontWeight: "bold",
                                                            fontStyle: "italic",
                                                            fontSize: "1.125rem",
                                                        }}
                                                        onClick={() => handleOpenEditDialog(null, seccion, indexSeccion, -1)}
                                                        startIcon={<AddCircleIcon />}
                                                    >
                                                        Agregar Campo
                                                    </Button>
                                                </Grid>
                                            )}
                                        </Paper>
                                    )}
                                </Droppable>
                            ))}
                        </DragDropContext>

                        {/* Agregar Sección */}
                        {usuarioLogeado && rolesEditarReporte.includes(parseInt(usuarioLogeado.rol)) && (
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                    textTransform: "none", fontWeight: "bold", fontStyle: "italic", fontSize: "1.5rem", mt: 2
                                }}
                                onClick={() => {
                                    setEditedSection({ titulo: "" });
                                    setOpenSectionDialog(true);
                                }}
                                startIcon={<AddCircleIcon style={{ fontSize: "1.5rem" }} />}
                            >
                                Agregar Sección
                            </Button>
                        )}

                        {/* Navbar Evidencias, Descargar Reporte, Guardar Plantilla, Autorizar Reporte */}
                        {usuarioLogeado && rolesNavbarEvidencia.includes(parseInt(usuarioLogeado.rol)) && (
                            <NavbarEvidencia
                                evidencias={evidencias}
                                refreshEvidencias={refreshEvidencia}
                                usuarioLogeado={usuarioLogeado}
                                rolesGestionarEvidencias={rolesGestionarEvidencias}
                                rolesDescargarReporte={rolesDescargarReporte}
                                rolesGuardarPlantilla={rolesGuardarPlantilla}
                                rolesAutorizarReporte={rolesAutorizarReporte}
                                fetchData={fetchData}
                                reporteAutorizado={reporteAutorizado}
                            />
                        )}
                    </Container>

                    {/* Diálogo de edición de campo */}
                    <Dialog open={openDialog} maxWidth="lg" fullWidth>
                        <DialogContent>
                            <Grid container>
                                <Grid item xs={6} container direction="column" sx={{ height: '70vh', overflowY: 'auto' }} borderColor={"secondary.main"}>
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
                                                        autoComplete="off"
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
                                                            value={editedField.tipo ? editedField.tipo.toLowerCase() : "texto"}
                                                            sx={{ width: "99%" }}
                                                            onChange={(event) => {
                                                                const newTipo = event.target.value;
                                                                const newCampo = { ...editedField };

                                                                const currentTipo = newCampo.tipo ? newCampo.tipo.toLowerCase() : "";

                                                                if ((currentTipo === "texto" || currentTipo === "numerico" || currentTipo === "fecha") && newTipo.toLowerCase() === "booleano") {
                                                                    newCampo.contenido = true;
                                                                } else if (currentTipo === "tabla" || currentTipo === "booleano" || currentTipo === "fecha") {
                                                                    newCampo.contenido = "";
                                                                } else if ((currentTipo === "texto" || currentTipo === "numerico" || currentTipo === "booleano") && newTipo.toLowerCase() === "fecha") {
                                                                    newCampo.contenido = new Date().toISOString();
                                                                }

                                                                newCampo.tipo = newTipo;
                                                                setEditedField({ ...editedField, tipo: newTipo, contenido: newCampo.contenido });
                                                            }}
                                                        >
                                                            <MenuItem value="texto">Texto</MenuItem>
                                                            <MenuItem value="numerico">Número</MenuItem>
                                                            <MenuItem value="fecha">Fecha</MenuItem>
                                                            <MenuItem value="booleano">Alternativa Única</MenuItem>
                                                            <MenuItem value="tabla">Tabla</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    {editedField.tipo ? (
                                                        editedField.tipo.toLowerCase() === "booleano" ? (
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
                                                        ) : editedField.tipo.toLowerCase() === "tabla" ? (
                                                            <Button
                                                                variant="contained"
                                                                onClick={() => handleOpenTableDialog(editedField.contenido, -1)}
                                                                sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "normal", fontSize: "1rem", width: "99%", mt: 2 }}
                                                            >
                                                                Editar Tabla
                                                            </Button>
                                                        ) : editedField.tipo.toLowerCase() === "fecha" ? (
                                                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                                                <DatePicker
                                                                    label="Fecha"
                                                                    name="contenido"
                                                                    variant="outlined"
                                                                    margin="normal"
                                                                    sx={{ width: "99%", my: 2 }}
                                                                    value={editedField.contenido ? new Date(editedField.contenido) : null}
                                                                    inputFormat="dd/MM/yyyy"  // O 'dd/MM/yy' si prefieres
                                                                    onChange={(date) => {
                                                                        if (date) {
                                                                            const formattedDate = date.toISOString();
                                                                            setEditedField({ ...editedField, contenido: formattedDate });
                                                                        }
                                                                    }}
                                                                />
                                                            </LocalizationProvider>
                                                        ) : editedField.tipo.toLowerCase() === "numerico" ? (
                                                            <>
                                                                <TextField
                                                                    label="Valor"
                                                                    type="number"
                                                                    name="contenido"
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    margin="normal"
                                                                    autoComplete="off"
                                                                    sx={{ width: "99%" }}
                                                                    value={editedField.contenido}
                                                                    onChange={handleFieldChange}
                                                                    InputProps={{
                                                                        endAdornment: (
                                                                            <InputAdornment position="end">
                                                                                {editedField.porcentaje ? '%' : ''}
                                                                            </InputAdornment>
                                                                        ),
                                                                        inputProps: { step: "any" }
                                                                    }}
                                                                />

                                                                <FormControlLabel
                                                                    label="Porcentaje"
                                                                    control={
                                                                        <Checkbox
                                                                            checked={editedField.porcentaje}
                                                                            onChange={(event) => {
                                                                                setEditedField({ ...editedField, porcentaje: event.target.checked });
                                                                            }}
                                                                            inputProps={{ 'aria-label': 'controlled' }}
                                                                        />
                                                                    }
                                                                />
                                                            </>

                                                        ) : (
                                                            <TextField
                                                                label="Valor"
                                                                name="contenido"
                                                                variant="outlined"
                                                                fullWidth
                                                                multiline
                                                                autoComplete="off"
                                                                minRows={4}
                                                                margin="normal"
                                                                sx={{ width: "99%" }}
                                                                value={editedField.contenido || ""}
                                                                onChange={handleFieldChange}
                                                            />
                                                        )
                                                    ) : null}
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
                                                                    autoComplete="off"
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
                                                                            if (newSubcampos[index].tipo === "Booleano" || newSubcampos[index].tipo === "Fecha") {
                                                                                newSubcampos[index].contenido = "";
                                                                            }
                                                                            newSubcampos[index].tipo = event.target.value;
                                                                            setEditedField({ ...editedField, subCampos: newSubcampos });
                                                                        }}
                                                                    >
                                                                        <MenuItem value="Texto">Texto</MenuItem>
                                                                        <MenuItem value="Numerico">Número</MenuItem>
                                                                        <MenuItem value="Fecha">Fecha</MenuItem>
                                                                        <MenuItem value="Booleano">Alternativa Única</MenuItem>
                                                                        <MenuItem value="Tabla">Tabla</MenuItem>
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
                                                                ) : subCampo.tipo === "Tabla" ? (
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => handleOpenTableDialog(subCampo.contenido, index)}
                                                                        sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "normal", fontSize: "1rem", width: "100%", my: 2 }}
                                                                    >
                                                                        Editar Tabla
                                                                    </Button>
                                                                ) : subCampo.tipo === "Fecha" ? (
                                                                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                                                        <DatePicker
                                                                            label="Fecha del Subcampo"
                                                                            name={`subCampos-contenido-${index}`}
                                                                            variant="outlined"
                                                                            margin="normal"
                                                                            sx={{ width: "100%", my: 2 }}
                                                                            value={subCampo.contenido ? new Date(subCampo.contenido) : null}
                                                                            inputFormat="dd/MM/yyyy"
                                                                            onChange={(date) => {
                                                                                if (date) {
                                                                                    const formattedDate = date.toISOString();
                                                                                    const newSubcampos = [...editedField.subCampos];
                                                                                    newSubcampos[index].contenido = formattedDate;
                                                                                    setEditedField({ ...editedField, subCampos: newSubcampos });
                                                                                }
                                                                            }}
                                                                            renderInput={(params) => <TextField {...params} />}
                                                                        />
                                                                    </LocalizationProvider>
                                                                ) : subCampo.tipo === "Numerico" ? (
                                                                    <>
                                                                        <TextField
                                                                            label="Valor del Subcampo"
                                                                            type="number"
                                                                            name={`subCampos-contenido-${index}`}
                                                                            variant="outlined"
                                                                            fullWidth
                                                                            margin="normal"
                                                                            autoComplete="off"
                                                                            sx={{ width: "100%", my: 2 }}
                                                                            value={subCampo.contenido}
                                                                            onChange={(event) => {
                                                                                const newSubcampos = [...editedField.subCampos];
                                                                                newSubcampos[index].contenido = event.target.value;
                                                                                setEditedField({ ...editedField, subCampos: newSubcampos });
                                                                            }}
                                                                            InputProps={{
                                                                                endAdornment: (
                                                                                    <InputAdornment position="end">
                                                                                        {subCampo.porcentaje ? '%' : ''} {/* Muestra '%' al final si está incluido */}
                                                                                    </InputAdornment>
                                                                                ),
                                                                                inputProps: { step: "any" } // Permite decimales
                                                                            }}
                                                                        />
                                                                        <FormControlLabel label="Porcentaje" control={
                                                                            <Checkbox
                                                                                checked={subCampo.porcentaje}
                                                                                onChange={(event) => {
                                                                                    const newSubcampos = [...editedField.subCampos];
                                                                                    if (event.target.checked) {
                                                                                        newSubcampos[index].porcentaje = true;
                                                                                    } else {
                                                                                        newSubcampos[index].porcentaje = false;
                                                                                    }
                                                                                    setEditedField({ ...editedField, subCampos: newSubcampos });
                                                                                }}
                                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                            />
                                                                        } />
                                                                    </>
                                                                ) : (
                                                                    <TextField
                                                                        label="Valor del Subcampo"
                                                                        name={`subCampos-contenido-${index}`}
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        multiline
                                                                        minRows={4}
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
                                                                <Button
                                                                    color="error"
                                                                    onClick={() => handleDeleteSubcampo(index)}
                                                                    startIcon={<CloseIcon />}
                                                                    sx={{
                                                                        transition: "transform 0.2s",
                                                                        '&:hover': {
                                                                            transform: "scale(1.02)",
                                                                        },
                                                                    }}
                                                                >
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
                                                        startIcon={<AddCircleOutlineIcon />}
                                                        sx={{
                                                            transition: "transform 0.2s",
                                                            '&:hover': {
                                                                transform: "scale(1.02)",
                                                            },
                                                        }}
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
                                                autoComplete="off"
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
                                                                        ml: 2,
                                                                        p: 0,
                                                                        transition: "transform 0.2s",
                                                                        '&:hover': {
                                                                            transform: "scale(1.02)",
                                                                        },
                                                                    }}
                                                                    onClick={() => accederEvidencia(evidencia)}
                                                                >
                                                                    {evidencia.tipo.toLowerCase() === "archivo" ? "Archivo" : "Página Web"}
                                                                </Button>
                                                            </Grid>
                                                            <Grid item xs={6} container justifyContent="flex-end">
                                                                <Button
                                                                    color="cuaternary"
                                                                    variant="text"
                                                                    startIcon={<AddCircleOutlineIcon />}
                                                                    onClick={() => handleAgregarEvidenciaAlCampo(evidencia)}
                                                                    sx={{
                                                                        transition: "transform 0.2s",
                                                                        '&:hover': {
                                                                            transform: "scale(1.02)",
                                                                        },
                                                                    }}
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
                                                                        textTransform: "none",
                                                                        fontWeight: "bold",
                                                                        color: "primary.main",
                                                                        ml: 2,
                                                                        p: 0,
                                                                        transition: "transform 0.2s",
                                                                        '&:hover': {
                                                                            transform: "scale(1.02)",
                                                                        },
                                                                    }}
                                                                    onClick={() => accederEvidencia(evidencia)}
                                                                >
                                                                    {evidencia.tipo.toLowerCase() === "archivo" ? "Archivo" : "Página Web"}
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
                            {isAdding ? null : (
                                <Button onClick={() => handleEliminarCampoDialog(campoActualIndex, seccionActualIndex)} color="error">Eliminar</Button>
                            )}
                            <Button onClick={() => handleCloseEditDialog()} color="secondary">Descartar</Button>
                            <Button onClick={() => handleSaveField()} color="primary">Guardar</Button>
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
                                    <IconButton onClick={() => handleCloseSectionEditDialog()} disableRipple><CloseIcon /></IconButton>
                                </Grid>
                                <Grid item xs={12} >
                                    <Typography variant="body1" sx={{ px: 2, mb: 2, mt: -1 }}>
                                        Introduzca el título de la sección:
                                    </Typography>
                                    <Box sx={{ px: 2 }}>
                                        <TextField
                                            label="Título de la Sección"
                                            variant="outlined"
                                            fullWidth
                                            autoComplete="off"
                                            value={editedSection.titulo}
                                            onChange={(event) => setEditedSection({ ...editedSection, titulo: event.target.value })}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Grid container>
                                <Grid item xs={12} container justifyContent="flex-end">
                                    <Button onClick={() => handleOpenEliminarSeccion()} color="error">
                                        Eliminar
                                    </Button>
                                    <Button color="secondary" variant="text" onClick={() => handleCloseSectionEditDialog()} >
                                        Descartar
                                    </Button>
                                    <Button color="cuaternary" variant="text" onClick={() => handleSaveSection(false)} >
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
                                <Grid item xs={12}>
                                    <Typography variant="body1" sx={{ px: 2, mb: 2, mt: -1 }}>
                                        Introduzca el título de la categoría:
                                    </Typography>
                                    <Box sx={{ px: 2 }}>
                                        <TextField
                                            label="Título de la Categoría"
                                            variant="outlined"
                                            autoComplete="off"
                                            fullWidth
                                            value={tituloIngresado}
                                            onChange={(event) => setTituloIngresado(event.target.value)}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Grid container>
                                <Grid item xs={12} container justifyContent="flex-end">
                                    <Button color="error" onClick={() => setOpenEliminarCategoriaDialog(true)}>
                                        Eliminar
                                    </Button>
                                    <Button color="secondary" variant="text" onClick={() => setOpenCategoryEditDialog(false)} >
                                        Descartar
                                    </Button>
                                    <Button color="cuaternary" variant="text" onClick={() => handleEditCategory()} >
                                        Guardar
                                    </Button>
                                </Grid>
                            </Grid>
                        </DialogActions>
                    </Dialog>

                    {/* Diálogo para eliminar categoría */}
                    <Dialog open={openEliminarCategoriaDialog} maxWidth="md" fullWidth>
                        <DialogTitle>
                            <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 1 }}>Eliminar Categoría</Typography>
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
                    <Dialog open={openEliminarSeccionDialog} maxWidth="md" fullWidth>
                        <DialogTitle>
                            <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 1 }}>Eliminar Sección</Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="body1">¿Está seguro de que desea eliminar la sección "{secciones.length > 0 ? (secciones[seccionActualIndex] ? secciones[seccionActualIndex].titulo : '') : ''}"?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button color="secondary" variant="text" onClick={() => handleCloseEliminarSeccion()}>
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
                                        autoComplete="off"
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
                    <Dialog open={openEliminarCampoDialog} onClose={() => handleCerrarEliminarCampoDialog()} maxWidth="md" fullWidth>
                        <DialogTitle>
                            <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 1 }}>Eliminar Campo</Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="body1">
                                ¿Está seguro de que desea eliminar el campo "{secciones[seccionActualIndex] && secciones[seccionActualIndex].campos[campoActualIndex] ? secciones[seccionActualIndex].campos[campoActualIndex].titulo : ''}"?
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button color="secondary" variant="text" onClick={() => handleCerrarEliminarCampoDialog()} >
                                Cancelar
                            </Button>
                            <Button color="error" variant="text" onClick={() => handleEliminarCampo()} >
                                Eliminar
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Diálogo para ver tabla */}
                    <Dialog open={openVerTablaDialog} onClose={handleCloseVerTabla} maxWidth="xl" fullWidth>
                        <DialogTitle>
                            <Typography variant="h5" color="primary" fontWeight="bold">
                                Datos de la Tabla
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <VerTabla csvString={csvData} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseVerTabla} color="primary">
                                Cerrar
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Diálogo para editar tabla */}
                    <Dialog open={openTableDialog} maxWidth="xl" fullWidth>
                        <DialogTitle>
                            <Typography variant="h5" color="primary" fontWeight="bold">
                                Editar Tabla
                            </Typography>
                            <IconButton onClick={handleCloseTableDialog} style={{ position: 'absolute', right: 8, top: 8 }}>
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <Tabla csvString={csvData} onSave={handleSaveTable} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => handleCloseTableDialog()} color="secondary">Cerrar</Button>
                        </DialogActions>
                    </Dialog>

                    {/* Diálogo para autorizar campo */}
                    <Dialog open={openAutorizarCampoDialog} onClose={() => setOpenAutorizarCampoDialog(false)} maxWidth="md" fullWidth>
                        <DialogTitle>
                            <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 1 }}>Autorizar Campo</Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="body1" sx={{ p: 2 }}>
                                {secciones[seccionActualIndex]
                                    && secciones[seccionActualIndex].campos[campoActualIndex]
                                    && secciones[seccionActualIndex].campos[campoActualIndex].autorizado === true
                                    ? "El campo ya ha sido autorizado. ¿Está seguro de que desea revocar la autorización del campo y habilitarlo para la edición?"
                                    : "¿Está seguro de que desea autorizar el campo? Una vez autorizado, no podrá realizar cambios en el campo."
                                }
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button color="secondary" variant="text" onClick={() => setOpenAutorizarCampoDialog(false)} >
                                Cancelar
                            </Button>
                            <Button color={secciones[seccionActualIndex]
                                && secciones[seccionActualIndex].campos[campoActualIndex]
                                && secciones[seccionActualIndex].campos[campoActualIndex].autorizado === true
                                ? "error"
                                : "cuaternary"} variant="text" onClick={() => handleAutorizarCampo()}>
                                {secciones[seccionActualIndex]
                                    && secciones[seccionActualIndex].campos[campoActualIndex]
                                    && secciones[seccionActualIndex].campos[campoActualIndex].autorizado === true
                                    ? "Revocar Autorización"
                                    : "Autorizar"
                                }
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Diálogo para ver la evidencia del campo */}
                    <Dialog open={openEvidenciaDialog} onClose={() => setOpenEvidenciaDialog(false)} maxWidth="md" fullWidth>
                        <DialogTitle>
                            <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 1 }}>Evidencias del campo "{secciones[seccionActualIndex] && secciones[seccionActualIndex].campos[campoActualIndex] ? secciones[seccionActualIndex].campos[campoActualIndex].titulo : ''}"</Typography>
                        </DialogTitle>
                        <DialogContent>
                            {selectedEvidencias && (
                                <>
                                    {selectedEvidencias.map((evidencia, index) => (
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
                                                        fontWeight: "normal"
                                                    }}>
                                                        {evidencia.tipo.toLowerCase() === 'archivo' ? evidencia.nombreOriginal : formatUrl(evidencia.url)}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6} container justifyContent={"flex-end"}>
                                                    <Tooltip title={evidencia.tipo.toLowerCase() === 'archivo' ? "Descargar" : "Abrir"} placement="bottom" arrow>
                                                        <IconButton
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={() => accederEvidencia(evidencia)}
                                                        >
                                                            {evidencia.tipo.toLowerCase() === 'archivo' ? <CloudDownloadIcon /> : <OpenInNewIcon />}
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    ))}
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button color="secondary" variant="text" onClick={() => setOpenEvidenciaDialog(false)} >
                                Cerrar
                            </Button>
                        </DialogActions>
                    </Dialog>

                </>
            )}

        </>
    );
}

export default Reporte;