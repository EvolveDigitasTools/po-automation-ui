import React, { useEffect, useState } from "react";
import { TextField, Grid, Autocomplete, Box } from "@mui/material";

export default function Address({ value, onChange, editMode }) {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [statesNoOptionsText, setStatesNoOptionsText] = useState("Please select a country first");
    const [citiesNoOptionsText, setCitiesNoOptionsText] = useState("Please select a state first");

    useEffect(() => {
        const getCountries = async () => {
            const countriesURL = `${process.env.REACT_APP_SERVER_URL}/utils/countries`;
            const dataResponse = await fetch(countriesURL);
            const data = await dataResponse.json();
            setCountries(data);
        };

        const asyncUseEffect = async () => {
            await getCountries();
        };
        asyncUseEffect();
    }, []);

    useEffect(() => {
        const getStates = async (country_code) => {
            if (!country_code || country_code === "") {
                setStates([]);
                setCities([]);
                return;
            }
            setStatesNoOptionsText("Loading...");
            const statesURL = `${process.env.REACT_APP_SERVER_URL}/utils/states?country_code=${country_code}`;
            const dataResponse = await fetch(statesURL);
            const data = await dataResponse.json();
            if (data.length === 0) {
                setStates(["Not Applicable"]);
                setCities(["Not Applicable"]);
            }
            else {
                setStates(data);
                setCities([]);
            }
            setStatesNoOptionsText("Please select a country first.");
        };

        const asyncUseEffect = async () => {
            await getStates(value.country?.iso2);
        };
        asyncUseEffect();
    }, [value.country]);

    useEffect(() => {
        const getCities = async (state_code) => {
            if (!state_code || state_code === "") {
                setCities([]);
                return;
            };
            setCitiesNoOptionsText("Loading...");
            const citiesURL = `${process.env.REACT_APP_SERVER_URL}/utils/cities?state_code=${state_code}`;
            const dataResponse = await fetch(citiesURL);
            const data = await dataResponse.json();
            if (data.length === 0)
                setCities(["Not Applicable"]);
            else
                setCities(data);
            setCitiesNoOptionsText("Please select a state first.");
        };

        const asyncUseEffect = async () => {
            await getCities(value.state?.state_code);
        };
        asyncUseEffect();
    }, [value.state]);

    const updateAddress = (id, newValue) => {
        const newAddress = {
            ...value,
            [id]: newValue,
        };
        // If the id is "country", set "state" and "city" to null
        if (id === "country") {
            newAddress.state = null;
            newAddress.city = null;
        }

        // If the id is "state", set "city" to null
        if (id === "state") {
            newAddress.city = null;
        }
        onChange(newAddress);
    };

    return (
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12}>
                <h2>Address</h2>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    InputProps={{
                        readOnly: editMode ? false : true,
                    }}
                    id="addressLine1"
                    label="Address Line 1"
                    value={value.addressLine1}
                    fullWidth
                    size="small"
                    onChange={(e) =>
                        updateAddress("addressLine1", e.target.value)
                    }
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    InputProps={{
                        readOnly: editMode ? false : true,
                    }}
                    fullWidth
                    size="small"
                    id="addressLine2"
                    label="Address Line 2"
                    value={value.addressLine2}
                    onChange={(e) =>
                        updateAddress("addressLine2", e.target.value)
                    }
                />
            </Grid>
            <Grid item xs={6}>
                {editMode ? (
                    <Autocomplete
                        id="country"
                        disablePortal
                        options={countries}
                        getOptionLabel={(option) =>
                            option.name ? option.name : ""
                        }
                        renderOption={(props, option) => (
                            <Box
                                component="li"
                                sx={{
                                    "& > img": {
                                        mr: 2,
                                        flexShrink: 0,
                                    },
                                }}
                                {...props}
                            >
                                <img
                                    loading="lazy"
                                    width="20"
                                    src={`https://flagcdn.com/w20/${option.iso2.toLowerCase()}.png`}
                                    srcSet={`https://flagcdn.com/w40/${option.iso2.toLowerCase()}.png 2x`}
                                    alt=""
                                />
                                {option.name} ({option.iso2})
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                required
                                {...params}
                                label="Choose a country"
                                inputProps={{
                                    ...params.inputProps,
                                    autoComplete: "new-password", // disable autocomplete and autofill
                                    style: { width: "auto" },
                                }}
                            />
                        )}
                        size="small"
                        value={value.country}
                        onChange={(e, newValue) =>
                            updateAddress("country", newValue)
                        }
                    />
                ) : (
                    <TextField
                        id="country"
                        InputProps={{
                            readOnly: true,
                        }}
                        label="Country"
                        fullWidth
                        size="small"
                        value={value.country}
                    />
                )}
            </Grid>
            <Grid item xs={6}>
                {editMode ? (
                    <Autocomplete
                        disablePortal
                        size="small"
                        id="state"
                        options={states}
                        getOptionLabel={(option) =>
                            option.name ? option.name : ""
                        }
                        renderInput={(params) => (
                            <TextField
                                required
                                {...params}
                                inputProps={{
                                    ...params.inputProps,
                                    autoComplete: "new-password",
                                    style: { width: "auto" },
                                }}
                                label="State"
                            />
                        )}
                        value={value.state}
                        noOptionsText={statesNoOptionsText}
                        onChange={(e, newValue) =>
                            updateAddress("state", newValue)
                        }
                    />
                ) : (
                    <TextField
                        InputProps={{
                            readOnly: true,
                        }}
                        id="state"
                        label="State"
                        fullWidth
                        size="small"
                        value={value.state}
                    />
                )}
            </Grid>
            <Grid item xs={6}>
                {editMode ? (
                    <Autocomplete
                        disablePortal
                        size="small"
                        id="city"
                        options={cities}
                        getOptionLabel={(option) =>
                            option.name ? option.name : ""
                        }
                        renderInput={(params) => (
                            <TextField
                                required
                                {...params}
                                inputProps={{
                                    ...params.inputProps,
                                    autoComplete: "new-password",
                                    style: { width: "auto" },
                                }}
                                label="City"
                            />
                        )}
                        value={value.city}
                        noOptionsText={citiesNoOptionsText}
                        onChange={(e, newValue) =>
                            updateAddress("city", newValue)
                        }
                    />
                ) : (
                    <TextField
                        id="city"
                        InputProps={{
                            readOnly: true,
                        }}
                        label="City"
                        fullWidth
                        size="small"
                        value={value.city}
                    />
                )}
            </Grid>
            <Grid item xs={6}>
                <TextField
                    required
                    InputProps={{
                        readOnly: editMode ? false : true,
                    }}
                    label="Postal Code"
                    id="postalCode"
                    type="number"
                    value={value.postalCode}
                    onChange={(e) =>
                        updateAddress("postalCode", e.target.value)
                    }
                    fullWidth
                    size="small"
                />
            </Grid>
        </Grid>
    );
}
