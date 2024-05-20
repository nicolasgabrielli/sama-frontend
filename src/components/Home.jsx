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
                
            </Container>
        </>
    );
    }

export default HomeComponent;