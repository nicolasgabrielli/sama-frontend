import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Box, Collapse, Tabs, Tab, IconButton, Button } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link } from "react-router-dom";
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';

function NavbarReporte({ useSectionMode, secciones, seccionesRutas, seccionActual }) {
    const [openCollapse, setOpenCollapse] = useState(true);
    const [tabValue, setTabValue] = useState(secciones ? secciones.indexOf(seccionActual) : 0);

    const toggleCollapse = () => {
        setOpenCollapse(!openCollapse);
    };

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const tabStyle = {
        textTransform: "none",
        fontSize: "1.2rem",
    };

    return (
        <React.Fragment>
            <AppBar position="sticky">
                <Toolbar color="primary">
                    {useSectionMode && (
                        <IconButton
                            onClick={toggleCollapse}
                            color="inherit"
                            size="large"
                            sx={{ transition: "transform 0.3s", transform: openCollapse ? "rotateX(180deg)" : "rotateX(0deg)" }}
                        >
                            <KeyboardArrowDownIcon />
                        </IconButton>
                    )}
                    <Typography variant="h4" component="div" sx={{ mr: 2, fontFamily: "Copperplate Gothic", fontWeight: "bold" }}>
                        SAMA
                    </Typography>
                    <Typography variant="h5" component="div" noWrap sx={{ display: { xs: "none", md: "flex" }, fontStyle: "italic" }}>
                        Administrador GRC
                    </Typography>
                </Toolbar>
                {useSectionMode && (
                    <Collapse in={openCollapse} timeout="auto" unmountOnExit>
                        <Box sx={{ bgcolor: "white", borderBottom: 1, borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", height: "100%" }}>
                            <Tabs
                                value={tabValue}
                                onChange={handleChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{
                                    flexGrow: 1,
                                    "& .MuiTabs-scrollButtons": {
                                        color: "black",
                                    },
                                }}
                            >
                                {secciones && seccionesRutas && secciones.map((seccion, index) => (
                                    <Tab
                                        key={index}
                                        label={seccion}
                                        value={index}
                                        component={Link}
                                        to={seccionesRutas[index]}
                                        sx={{ ...tabStyle, fontWeight: tabValue === index ? "bold" : "normal" }}
                                    />
                                ))}
                            </Tabs>
                            <Button variant="contained" sx={{ textTransform: "none", fontWeight: "bold", fontStyle: "normal", fontSize: "1rem", m: 0.5 }}>
                                Agregar Categoría <AddCircleOutlinedIcon sx={{ ml: 0.5, mr: -0.5 }}/>
                            </Button>
                        </Box>
                    </Collapse>
                )}

            </AppBar>
        </React.Fragment>
    );
}

export default NavbarReporte;
