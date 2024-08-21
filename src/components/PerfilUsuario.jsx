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
  Tooltip,
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
import CancelIcon from '@mui/icons-material/Cancel';
import LockIcon from '@mui/icons-material/Lock';

function PerfilUsuario() {
  const { id } = useParams();
  const [usuarioLogeado, setUsuarioLogeado] = useState(null);
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({});
  const [editActivated, setEditActivated] = useState(false);
  const [listaEmpresas, setListaEmpresas] = useState([]);
  const [selectedEmpresas, setSelectedEmpresas] = useState([]);
  const [filteredEmpresas, setFilteredEmpresas] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(true);
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;


  useEffect(() => {
    usuarioService.getUsuarioLogueado().then((response) => {
      if (response && (response.data.rol === "0" || response.data.id === id)) {
        setUsuarioLogeado(response.data);
      } else {
        navigate("/login");
      }
    });
    fetchUsuario();
  }, [id]);

  const fetchUsuario = async () => {
    setLoading(true); // Inicia el estado de carga

    try {
        // Obtener la lista de empresas
        try {
            const response = await empresaService.getListaEmpresas();
            const empresas = response.data || []; // Usa un array vacío si no hay datos
            setListaEmpresas(empresas);
            setFilteredEmpresas(empresas);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Si se recibe un error 404, establece empresas como un array vacío
                setListaEmpresas([]);
                setFilteredEmpresas([]);
            } else {
                // Maneja otros errores de la solicitud de empresas
                console.error("Error al obtener la lista de empresas:", error);
                // Manejar el caso de error si es necesario
            }
        }

        // Obtener los datos del usuario
        const userResponse = await usuarioService.getUsuario(id);
        const userData = userResponse.data;

        // Mapear las empresas del usuario
        const userEmpresas = userData.empresas
            .map(id => listaEmpresas.find(empresa => empresa.id === id))
            .filter(empresa => empresa !== undefined); // Filtrar las empresas que no existen

        setUsuario({ ...userData, empresas: userEmpresas });
        setSelectedEmpresas(userEmpresas);
    } catch (error) {
        console.error("Error al obtener los detalles del usuario:", error);
        // Manejar el caso de error si es necesario
    } finally {
        setLoading(false); // Finaliza el estado de carga
    }
};


  // Funciones para restaurar el estado de edición.
  const handleDescartarCambios = () => {
    if (editActivated) {
      setEditActivated(false);
      setEditMode({});
      fetchUsuario();
    }
  };

  const handleEditToggle = (field) => {
    setEditActivated(true);
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
      if (field) {
        const updatedFields = {};
        updatedFields.id = usuario.id;
        if (field === "nombre") updatedFields.nombre = usuario.nombre;
        if (field === "correo") updatedFields.correo = usuario.correo;
        if (field === "rol") updatedFields.rol = usuario.rol;
        if (field === "empresas") {
          updatedFields.empresas = selectedEmpresas.map((e) => e.id);
        }
        if (field === "password" && passwordValid) {
          updatedFields.contrasenia = newPassword;
        }
        await usuarioService.actualizarUsuario(id, updatedFields);
        setEditMode((prevEditMode) => ({
          ...prevEditMode,
          [field]: false,
        }));

        if (field === "password" && passwordValid) {
          setNewPassword("");
        }
        fetchUsuario();
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  const handleSelectAll = () => {
    setSelectedEmpresas(filteredEmpresas.sort((a, b) => a.nombre.localeCompare(b.nombre)));
    setEditActivated(true);
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      empresas: true
    }));
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setFilteredEmpresas(listaEmpresas.filter(empresa => empresa.nombre.toLowerCase().includes(query)));
  };

  const handleEmpresaToggle = (empresa) => {
    const isSelected = selectedEmpresas.some(e => e.id === empresa.id);
    const newSelected = isSelected
      ? selectedEmpresas.filter(e => e.id !== empresa.id)
      : [...selectedEmpresas, empresa];

    setSelectedEmpresas(newSelected.sort((a, b) => a.nombre.localeCompare(b.nombre)));

    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      empresas: true,
    }));

    setEditActivated(true);
  };

  const isSelected = (empresa) => selectedEmpresas.some(e => e.nombre === empresa.nombre);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);

    const isValid = passwordRegex.test(newPassword);
    setPasswordValid(isValid);
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
                {usuario ? usuario.nombre.charAt(0) : ""}
              </Avatar>
              <Typography variant="h4" sx={{ mt: 2 }}>
                {usuario ? usuario.nombre : ""}
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
                  <strong>Nombre:</strong> {usuario ? usuario.nombre : ""}
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
                  <strong>Email:</strong> {usuario ? usuario.correo : ""}
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
            {/* Cambiar Rol */}
            {usuarioLogeado && usuarioLogeado.rol === "0" && (
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
                    <strong>Rol:</strong> {usuario ? usuarioService.listaRoles[usuario.rol] : "2"}
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
            )}
            {/* Cambiar Contraseña */}
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              borderBottom={2}
              borderColor={"secondary.main"}
              sx={{ mx: 0, mb: 1, py: 1 }}
            >
              {editMode.password ? (
                <TextField
                  variant="standard"
                  type="password"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  error={!passwordValid && newPassword !== ""}
                  placeholder="Nueva contraseña"
                  label="Nueva Contraseña"
                  helperText={!passwordValid && newPassword !== "" ? "La contraseña debe tener al menos una mayúscula, una minúscula, un número, un símbolo, y al menos 8 caracteres." : ""}
                  sx={{ flexGrow: 1 }}
                />
              ) : (
                <Typography variant="body1">
                  <strong>Contraseña:</strong> ******
                </Typography>
              )}
              <IconButton
                onClick={() =>
                  (editMode.password && passwordValid) ? saveChanges("password") : handleEditToggle("password")
                }
              >
                {editMode.password ? (passwordValid ? <SaveIcon /> : <CancelIcon />) : <LockIcon />}
              </IconButton>
            </Grid>
            {/* Empresas */}
            {usuarioLogeado && usuarioLogeado.rol === "0" && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color={"primary.main"} fontWeight={"bold"}>
                    Acceso a empresas:
                  </Typography>
                  <Tooltip title={editMode.empresas ? "Guardar cambios de las empresas" : "No se han hecho cambios en las empresas"} placement="right">
                    <span>
                      <IconButton
                        onClick={() => saveChanges("empresas")}
                        disabled={!editMode.empresas}
                        sx={{ ml: 1 }}
                      >
                        <SaveIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
                <Autocomplete
                  disablePortal
                  fullWidth
                  multiple
                  options={filteredEmpresas}
                  getOptionLabel={(empresa) => empresa.nombre}
                  value={selectedEmpresas}
                  onChange={(event, newValue) => {
                    setSelectedEmpresas(newValue.sort((a, b) => a.nombre.localeCompare(b.nombre)));
                    setEditActivated(true);
                    setEditMode((prevEditMode) => ({
                      ...prevEditMode,
                      empresas: true
                    }));
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
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
              }}
            >
              <Button
                variant="outlined"
                color="error"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  fontStyle: "italic",
                  fontSize: "1rem",
                  width: "40%",
                }}
                startIcon={<CancelIcon />}
                onClick={handleDescartarCambios}
              >
                Descartar Cambios
              </Button>
            </Box>
          </Paper>
        </Container>
      )}
    </>
  );
}

export default PerfilUsuario;
