import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Box, Collapse, Tabs, Tab, IconButton } from "@mui/material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { Link } from "react-router-dom";

function Navbar({ useSectionMode, secciones, seccionesRutas, seccionActual }) {
    const [openCollapse, setOpenCollapse] = useState(true);
    const [tabValue, setTabValue] = useState(secciones ? secciones.indexOf(seccionActual) : 0);
    const [rol, setRol] = useState("Administrador");

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
                <Toolbar color={"primary.main"}>
                    {useSectionMode && (
                        <IconButton
                            onClick={toggleCollapse}
                            color="inherit"
                            size="large"
                            sx={{ transition: "transform 0.3s", transform: openCollapse ? "rotateX(180deg)" : "rotateX(0deg)" }}
                        >
                            <KeyboardArrowDown />
                        </IconButton>
                    )}
                    <Typography
                        variant="h4"
                        component="div"
                        sx={{
                            mr: 2
                        }}
                        fontFamily={"Copperplate Gothic"}
                        fontWeight={"bold"}
                    >
                        SAMA
                    </Typography>
                    <Typography
                        variant="h5"
                        component="div"
                        noWrap
                        sx={{
                            display: {
                                xs: "none",
                                md: "flex"
                            },
                            fontStyle: "italic",
                            pr: 1
                        }}
                    >
                       {rol}
                    </Typography>
                </Toolbar>
                <>{useSectionMode ?
                    <Collapse bgcolor="#ffffff" in={openCollapse} timeout="auto" unmountOnExit>
                        <Box bgcolor="#ffffff" sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <Tabs value={tabValue} onChange={handleChange}>
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
                        </Box>
                    </Collapse>
                    : null
                }
                </>
            </AppBar>
        </React.Fragment>
    );
}

export default Navbar;
