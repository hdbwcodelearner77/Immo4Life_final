import { Add } from '@mui/icons-material';
import { Fab } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Der Erstellen-Knopf für die Startseite
 * @returns Den Erstellen Knopf für die Startseite
 */
export const CreateRealEstateButton = () => {
    const navigate = useNavigate();

    return (
        <Fab onClick={() => navigate('/create')} color="primary" style={{ position: 'absolute', bottom: '2rem', right: '2rem' }}>
            <Add />
        </Fab>
    );
};
