import React, { useContext, useEffect, useState } from 'react';
import { RealEstateType } from '../resources';
import { DataContext } from '../screens/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';

/**
 * Die Toolbar für den Immobilientyp-Filter sowie den Adress-Filter
 * @returns Die Toolbar
 */
export const Toolbar = () => {
    const [filteredType, setFilteredType] = useState<RealEstateType | 'all'>('all');
    const [searchText, setSearchText] = useState('');
    const { setLoadData, setSearchData } = useContext(DataContext);

    const dropdownOptions = [
        {
            key: 'all',
            value: 'all',
            label: 'Alle anzeigen',
        },
        {
            key: 'apartment',
            value: 'apartment',
            label: 'Apartment',
        },
        {
            key: 'house',
            value: 'house',
            label: 'Haus',
        },
        {
            key: 'construction-site',
            value: 'construction-site',
            label: 'Grundstück',
        },
    ];

    useEffect(() => {
        filteredType && setLoadData(filteredType);
    }, [filteredType, setLoadData]);

    useEffect(() => {
        setSearchData(searchText);
    }, [searchText, setSearchData]);

    return (
        <div className="w-full mb-5 flex">
            <div className="w-1/2 flex flex-row">
                <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel id="label-select">Immobilien-Art</InputLabel>
                    <Select
                        labelId="label-selec"
                        value={filteredType}
                        defaultValue="all"
                        label="Immobilien-Art"
                        onChange={(event) => {
                            if (event.target.value === 'all') {
                                setFilteredType('all');
                            } else {
                                setFilteredType(event.target.value as RealEstateType);
                            }
                        }}
                    >
                        {dropdownOptions.map((option) => (
                            <MenuItem key={option.key} value={option.key}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel htmlFor="outlined-adornment-amount">Adress-Suche</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-amount"
                        startAdornment={
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        }
                        label="Adress-Suche"
                        placeholder="Text eingeben..."
                        onChange={(event) => {
                            setSearchText(event.target.value);
                        }}
                    />
                </FormControl>
            </div>
        </div>
    );
};
