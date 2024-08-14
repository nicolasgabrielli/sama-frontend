import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Paper,
  Avatar,
  Box,
  Button,
  CircularProgress,
  TextField,
  IconButton,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import usuarioService from "../services/UsuarioService";
import Navbar from "./Navbar";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function PerfilUsuario() {
  const { id } = useParams(); // Obtener el id del usuario desde la URL
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({}); // Track which fields are in edit mode

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await usuarioService.getUsuario(id);
        setUsuario(response.data);
      } catch (error) {
        console.error("Error al obtener los detalles del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [id]);

  const handleEditToggle = (field) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [field]: !prevEditMode[field],
    }));
  };

  const handleInputChange = (field, value) => {
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      [field]: value,
    }));
  };

  const saveChanges = async (field) => {
    // Aquí puedes implementar la lógica para guardar los cambios en el servidor.
    // Por ahora, solo cambiamos el modo de edición.
    handleEditToggle(field);
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
          <Grid item xs={6} container justifyContent="flex-end">
            <Link to="/usuarios">
              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  fontStyle: "italic",
                  mr: 1,
                  fontSize: "1.1rem",
                  maxHeight: 0.7,
                }}
                startIcon={<ArrowBackIcon />}
              >
                Volver
              </Button>
            </Link>
          </Grid>
          <Paper sx={{ p: 4, mt: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                mb: 4,
              }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: "primary.main",
                  fontSize: "3rem",
                }}
              >
                {usuario.nombre.charAt(0)}
              </Avatar>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {usuario.nombre}
              </Typography>
            </Box>
            <Typography
              variant="h5"
              color="primary"
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
              Información del Usuario
            </Typography>
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
                  value={usuario.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  sx={{ flexGrow: 1 }}
                />
              ) : (
                <Typography variant="body1">
                  <strong>Nombre:</strong> {usuario.nombre}
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
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              borderBottom={2}
              borderColor={"secondary.main"}
              sx={{ mx: 0, mb: 1, py: 1 }}
            >
              {editMode.correo ? (
                <TextField
                  variant="standard"
                  value={usuario.correo}
                  onChange={(e) => handleInputChange("correo", e.target.value)}
                  sx={{ flexGrow: 1 }}
                />
              ) : (
                <Typography variant="body1">
                  <strong>Email:</strong> {usuario.correo}
                </Typography>
              )}
              <IconButton
                onClick={() =>
                  editMode.correo ? saveChanges("correo") : handleEditToggle("correo")
                }
              >
                {editMode.correo ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Grid>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              borderBottom={2}
              borderColor={"secondary.main"}
              sx={{ mx: 0, mb: 1, py: 1 }}
            >
              {editMode.rol ? (
                <TextField
                  variant="standard"
                  value={usuario.rol}
                  onChange={(e) => handleInputChange("rol", e.target.value)}
                  sx={{ flexGrow: 1 }}
                />
              ) : (
                <Typography variant="body1">
                  <strong>Rol:</strong> {usuarioService.listaRoles[usuario.rol]}
                </Typography>
              )}
              <IconButton
                onClick={() =>
                  editMode.rol ? saveChanges("rol") : handleEditToggle("rol")
                }
              >
                {editMode.rol ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Grid>
          </Paper>
        </Container>
      )}
    </>
  );
}

export default PerfilUsuario;
