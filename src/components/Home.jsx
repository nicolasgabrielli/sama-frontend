import React from 'react';
import { Container, Typography } from '@mui/material';
import Navbar from './Navbar';

function HomeComponent() {
    const useSectionMode = true;
    const secciones = ["Home", "Empresas", "Usuarios"];
    const seccionesRutas = ["/", "/empresas", "/usuarios"];
    const seccionActual = "Home";

    

    return (
        <>
            <Navbar seccionActual={seccionActual} useSectionMode={useSectionMode} secciones={secciones} seccionesRutas={seccionesRutas}/>
            <Container >
                <Typography variant="h1" color={"primary.main"}>No se que poner xd</Typography>
            </Container>
        </>
    );
    }

export default HomeComponent;