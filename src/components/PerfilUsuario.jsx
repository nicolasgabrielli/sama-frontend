import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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
  Autocomplete,
  Checkbox,
  Select,
  MenuItem,
  ListItemText
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Search from '@mui/icons-material/Search';
import Check from '@mui/icons-material/Check';
import usuarioService from "../services/UsuarioService";
import empresaService from "../services/EmpresaService";
import Navbar from "./Navbar";

function PerfilUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({});
  const [listaEmpresas, setListaEmpresas] = useState([]);
  const [selectedEmpresas, setSelectedEmpresas] = useState([]);
  const [filteredEmpresas, setFilteredEmpresas] = useState([]);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await usuarioService.getUsuario(id);
        setUsuario(response.data);
        setSelectedEmpresas(response.data.empresas || []);
      } catch (error) {
        console.error("Error al obtener los detalles del usuario:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();

    const fetchEmpresas = async () => {
      try {
        const response = await empresaService.getListaEmpresas();
        setListaEmpresas(response.data);
        setFilteredEmpresas(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de empresas:", error);
      }
    };
    fetchEmpresas();
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
    try {
      await usuarioService.actualizarUsuario(usuario);
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    } finally {
      handleEditToggle(field);
    }
  };

  const handleSelectAll = () => {
    setSelectedEmpresas(filteredEmpresas.sort((a, b) => a.nombre.localeCompare(b.nombre)));
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setFilteredEmpresas(listaEmpresas.filter(empresa => empresa.nombre.toLowerCase().includes(query)));
  };

  const handleEmpresaToggle = (empresa) => {
    setSelectedEmpresas((prevSelected) =>
      prevSelected.some(e => e.nombre === empresa.nombre)
        ? prevSelected.filter(e => e.nombre !== empresa.nombre)
        : [...prevSelected, empresa].sort((a, b) => a.nombre.localeCompare(b.nombre))
    );
  };
  
  const isSelected = (empresa) => selectedEmpresas.some(e => e.nombre === empresa.nombre);

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
            {/* Correo */}
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
            {/* Rol */}
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              borderBottom={2}
              borderColor={"secondary.main"}
              sx={{ mx: 0, mb: 1, py: 1 }}
            >
              {editMode.rol ? (
                <Select
                  variant="standard"
                  value={usuario.rol}
                  onChange={(e) => handleInputChange("rol", e.target.value)}
                  sx={{ flexGrow: 1 }}
                >
                  {Object.entries(usuarioService.listaRoles).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
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
            {/* Empresas */}
            <Grid item xs={12} sx={{ p: 1 }}>
              <Typography variant="h6" color={"primary.main"} fontWeight={"bold"} sx={{ mb: 2 }}>Acceso a empresas:</Typography>
              <Autocomplete
                disablePortal
                fullWidth
                multiple
                options={filteredEmpresas}
                getOptionLabel={(empresa) => empresa.nombre}
                value={selectedEmpresas}
                onChange={(event, newValue) => {
                  setSelectedEmpresas(newValue.sort((a, b) => a.nombre.localeCompare(b.nombre)));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Empresas"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <Search />
                          {params.InputProps.startAdornment}
                        </>
                      ),
                      endAdornment: (
                        <>
                          <Button
                            onClick={handleSelectAll}
                            color="primary"
                            startIcon={<Check />}
                          >
                            Seleccionar Todo
                          </Button>
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                    onChange={handleSearchChange}
                  />
                )}
                renderOption={(props, option, { selected }) => (
                  <li key={option.nombre} {...props}>
                    <Checkbox
                      icon={<span className="MuiBox-root" />}
                      checkedIcon={<span className="MuiBox-root" />}
                      checked={isSelected(option)}
                      onClick={() => handleEmpresaToggle(option)}
                    />
                    <ListItemText primary={option.nombre} />
                  </li>
                )}
              />
            </Grid>
          </Paper>
        </Container>
      )}
    </>
  );
}

export default PerfilUsuario;
