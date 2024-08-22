import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import {
  Container,
  Grid,
  Typography,
  Paper,
  Select,
  MenuItem,
  Box,
  Button,
  CircularProgress,
  TextField,
  IconButton,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import empresaService from "../services/EmpresaService";
import Navbar from "./Navbar";

function EditarPerfilEmpresa() {
  const { idEmpresa } = useParams();
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({});
  const [errors, setErrors] = useState({});
  const rutRegex = /^[0-9]+-[0-9kK]$/;
  const emailRegex = /\S+@\S+\.\S+/;
  const telefonoRegex = /^\+?[0-9]{9,12}$/;


  const tiposSociedad = ["Sociedad Anónima", "Sociedad de Responsabilidad Limitada", "Empresa Individual", "Otra"];

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const response = await empresaService.getEmpresa(idEmpresa); // Cambia esta línea según cómo obtengas la empresa específica
        setEmpresa(response.data);
      } catch (error) {
        console.error("Error al obtener los detalles de la empresa:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmpresa();
  }, []);

  const handleEditToggle = (field) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [field]: !prevEditMode[field],
    }));
  };

  const handleInputChange = (field, value) => {
    let isValid = true;

    switch (field) {
      case "rut":
        isValid = rutRegex.test(value);
        break;
      case "email":
        isValid = emailRegex.test(value);
        break;
      case "telefono":
        if (value.trim() === "") {
          isValid = true;
          break;
        }
        isValid = telefonoRegex.test(value);
        break;
      default:
        break;
    }

    setEmpresa((prevEmpresa) => ({
      ...prevEmpresa,
      [field]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: !isValid,
    }));
  };

  const saveChanges = async (field) => {
    try {
      if (errors[field]) {
        return;
      }
      if ((field === "rut" || field === "razonSocial" || field === "nombre" || field === "domicilio" || field === "email") && empresa[field].trim() === "") {
        return;
      }
      await empresaService.actualizarEmpresa(empresa); // Cambia esto según tu servicio
      handleEditToggle(field);
    } catch (error) {
      console.error("Error al actualizar la empresa:", error);
    }
  };

  return (
    <>
      <Navbar useSectionMode={false} />
      {loading ? (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            bgcolor: "background.default",
          }}
        >
          <CircularProgress size={80} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Cargando...
          </Typography>
        </Box>
      ) : (
        <Container sx={{ mt: 4 }}>
          <Paper sx={{ p: 4, mt: 2, position: "relative" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                position: "absolute",
                top: 16,
                right: 16,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  fontStyle: "italic",
                  fontSize: "1.1rem",
                }}
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
              >
                Volver
              </Button>
            </Box>
            <Typography
              variant="h5"
              color="primary"
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
              Información de la Empresa
            </Typography>
            {/* Nombre */}
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              borderBottom={2}
              borderColor={"secondary.main"}
              sx={{ mx: 0, mb: 1, py: 1 }}
            >
              {editMode.nombre ? (
                <TextField
                  variant="standard"
                  value={empresa.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  sx={{ flexGrow: 1 }}
                  required
                />
              ) : (
                <Typography variant="body1">
                  <strong>Nombre de Fantasía:</strong> {empresa.nombre}
                </Typography>
              )}
              <IconButton
                onClick={() =>
                  editMode.nombre ? saveChanges("nombre") : handleEditToggle("nombre")
                }
              >
                {editMode.nombre ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Grid>
            {/* Tipo de Sociedad */}
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              borderBottom={2}
              borderColor={"secondary.main"}
              sx={{ mx: 0, mb: 1, py: 1 }}
            >
              {editMode.tipoSociedad ? (
                <Select
                  variant="standard"
                  value={empresa.tipoSociedad}
                  onChange={(e) => handleInputChange("tipoSociedad", e.target.value)}
                  sx={{ flexGrow: 1 }}
                >
                  {tiposSociedad.map((tipo, index) => (
                    <MenuItem key={index} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <Typography variant="body1">
                  <strong>Tipo de Sociedad:</strong> {empresa.tipoSociedad}
                </Typography>
              )}
              <IconButton
                onClick={() =>
                  editMode.tipoSociedad ? saveChanges("tipoSociedad") : handleEditToggle("tipoSociedad")
                }
              >
                {editMode.tipoSociedad ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Grid>
            {/* RUT */}
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              borderBottom={2}
              borderColor={"secondary.main"}
              sx={{ mx: 0, mb: 1, py: 1 }}
            >
              {editMode.rut ? (
                <TextField
                  variant="standard"
                  value={empresa.rut}
                  onChange={(e) => handleInputChange("rut", e.target.value)}
                  required
                  error={errors.rut}
                  helperText={errors.rut ? "RUT inválido. Ejemplo: 12345678-9" : ""}
                  sx={{ flexGrow: 1 }}
                />
              ) : (
                <Typography variant="body1">
                  <strong>RUT:</strong> {empresa.rut}
                </Typography>
              )}
              <IconButton
                onClick={() =>
                  editMode.rut ? saveChanges("rut") : handleEditToggle("rut")
                }
              >
                {editMode.rut ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Grid>
            {/* Domicilio */}
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              borderBottom={2}
              borderColor={"secondary.main"}
              sx={{ mx: 0, mb: 1, py: 1 }}
            >
              {editMode.domicilioEmpresa ? (
                <TextField
                  variant="standard"
                  value={empresa.domicilioEmpresa}
                  onChange={(e) => handleInputChange("domicilioEmpresa", e.target.value)}
                  sx={{ flexGrow: 1 }}
                />
              ) : (
                <Typography variant="body1">
                  <strong>Domicilio:</strong> {empresa.domicilioEmpresa}
                </Typography>
              )}
              <IconButton
                onClick={() =>
                  editMode.domicilioEmpresa ? saveChanges("domicilioEmpresa") : handleEditToggle("domicilioEmpresa")
                }
              >
                {editMode.domicilioEmpresa ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Grid>
            {/* Página Web */}
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              borderBottom={2}
              borderColor={"secondary.main"}
              sx={{ mx: 0, mb: 1, py: 1 }}
            >
              {editMode.paginaWeb ? (
                <TextField
                  variant="standard"
                  value={empresa.paginaWeb}
                  onChange={(e) => handleInputChange("paginaWeb", e.target.value)}
                  sx={{ flexGrow: 1 }}
                />
              ) : (
                <Typography variant="body1">
                  <strong>Página Web:</strong> {empresa.paginaWeb}
                </Typography>
              )}
              <IconButton
                onClick={() =>
                  editMode.paginaWeb ? saveChanges("paginaWeb") : handleEditToggle("paginaWeb")
                }
              >
                {editMode.paginaWeb ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Grid>
            {/* Razon Social */}
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              borderBottom={2}
              borderColor={"secondary.main"}
              sx={{ mx: 0, mb: 1, py: 1 }}
            >
              {editMode.razonSocial ? (
                <TextField
                  variant="standard"
                  value={empresa.razonSocial}
                  onChange={(e) => handleInputChange("razonSocial", e.target.value)}
                  required
                  sx={{ flexGrow: 1 }}
                />
              ) : (
                <Typography variant="body1">
                  <strong>Razon Social:</strong> {empresa.razonSocial}
                </Typography>
              )}
              <IconButton
                onClick={() =>
                  editMode.razonSocial ? saveChanges("razonSocial") : handleEditToggle("razonSocial")
                }
              >
                {editMode.razonSocial ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Grid>
            {/* Punto de Contacto */}
            <Typography
              variant="h6"
              color="primary"
              fontWeight="bold"
              sx={{ mb: 2, mt: 2 }}
            >
              Punto de Contacto
            </Typography>
            {/* Email */}
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              borderBottom={2}
              borderColor={"secondary.main"}
              sx={{ mx: 0, mb: 1, py: 1 }}
            >
              {editMode.email ? (
                <TextField
                  variant="standard"
                  value={empresa.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  error={errors.email}
                  helperText={errors.email ? "Email inválido." : ""}
                  required
                  sx={{ flexGrow: 1 }}
                />
              ) : (
                <Typography variant="body1">
                  <strong>Email:</strong> {empresa.email}
                </Typography>
              )}
              <IconButton
                onClick={() =>
                  editMode.email ? saveChanges("email") : handleEditToggle("email")
                }
              >
                {editMode.email ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Grid>
            {/* Domicilio Contacto */}
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              borderBottom={2}
              borderColor={"secondary.main"}
              sx={{ mx: 0, mb: 1, py: 1 }}
            >
              {editMode.domicilioContacto ? (
                <TextField
                  variant="standard"
                  value={empresa.domicilioContacto}
                  onChange={(e) => handleInputChange("domicilioContacto", e.target.value)}
                  sx={{ flexGrow: 1 }}
                />
              ) : (
                <Typography variant="body1">
                  <strong>Domicilio Contacto:</strong> {empresa.domicilioContacto}
                </Typography>
              )}
              <IconButton
                onClick={() =>
                  editMode.domicilioContacto ? saveChanges("domicilioContacto") : handleEditToggle("domicilioContacto")
                }
              >
                {editMode.domicilioContacto ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Grid>
            {/* Teléfono */}
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              borderBottom={2}
              borderColor={"secondary.main"}
              sx={{ mx: 0, mb: 1, py: 1 }}
            >
              {editMode.telefono ? (
                <TextField
                  variant="standard"
                  value={empresa.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  error={errors.telefono}
                  helperText={errors.telefono ? "Teléfono inválido." : ""}
                  sx={{ flexGrow: 1 }}
                />
              ) : (
                <Typography variant="body1">
                  <strong>Teléfono:</strong> {empresa.telefono}
                </Typography>
              )}
              <IconButton
                onClick={() =>
                  editMode.telefono ? saveChanges("telefono") : handleEditToggle("telefono")
                }
              >
                {editMode.telefono ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Grid>
            
          </Paper>
        </Container>
      )}
    </>
  );
}

export default EditarPerfilEmpresa;
