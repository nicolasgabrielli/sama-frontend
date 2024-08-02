import React, { useState } from 'react';
import { TextField, Button, Grid, Box, Typography, Paper, Container } from '@mui/material';
import Navbar from './Navbar';
import LoginService from "../services/LoginService";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (!email || !password) {
            setError('Por favor, completa todos los campos.');
        } else if (!validateEmail(email)) {
            setError('Por favor, introduce un correo electrónico válido.');
        } else {
            setError('');
            console.log('Iniciando sesión con:', { email, password });
            LoginService.login({ correo: email, contrasenia: password })
                .then(() => {
                    console.log('Sesión iniciada correctamente.');
                    window.location.href = '/';
                })
                .catch((error) => {
                    console.error('Error durante el login:', error);
                    setError('Error durante el login. Por favor, intenta de nuevo.');
                });
        }
    };

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const useSectionMode = false;
    const secciones = ["Empresas", "Usuarios"];
    const seccionesRutas = ["/empresas", "/usuarios"];
    const seccionActual = "Empresas";

    return (
        <>
            <Navbar seccionActual={seccionActual} useSectionMode={useSectionMode} secciones={secciones} seccionesRutas={seccionesRutas} />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    marginTop: '-64px' // Ajusta este valor si la barra de navegación tiene un tamaño diferente
                }}
            >
                <Container maxWidth="sm">
                    <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
                        <Typography variant="h4" gutterBottom>
                            Iniciar Sesión
                        </Typography>
                        {error && (
                            <Typography variant="body2" color="error" gutterBottom>
                                {error}
                            </Typography>
                        )}
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Correo Electrónico"
                                    variant="outlined"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Contraseña"
                                    variant="outlined"
                                    fullWidth
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleLogin}
                                >
                                    Iniciar Sesión
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
            </Box>
        </>
    );
}

export default Login;
