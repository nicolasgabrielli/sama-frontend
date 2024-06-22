import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const Loading = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                bgcolor: 'background.default',
            }}
        >
            <CircularProgress size={80} />
            <Typography variant="h6" sx={{ mt: 2 }}>
                Cargando...
            </Typography>
        </Box>
    );
}

export default Loading;