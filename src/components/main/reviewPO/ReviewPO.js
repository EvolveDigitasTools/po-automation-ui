import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Container, Paper, TextField, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

export default function ReviewPO() {
    const params = useParams();
    const [loading, setLoading] = useState(true)
    const [poCode, setPoCode] = useState('')
    const [denyReason, setDenyReason] = useState("");
    const [isReviewDone, setReviewDone] = useState(false)
    const [denyOpen, setDenyOpen] = useState(false);

    useEffect(() => {
        const validateToken = params.validateToken;
        const decodedToken = jwtDecode(validateToken);
        const poCode = decodedToken.vendorCode
        setPoCode(poCode)
        setLoading(false); 
        return () => {
        };
    }, []);

    const validateNewPO = async (e, isRecordValid) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData();
        formData.append("poCode", poCode);
        formData.append("isValid", isRecordValid);
        if (!isRecordValid)
            formData.append("reason", denyReason);

        const validateSKUUrl = `${process.env.REACT_APP_SERVER_URL}sku/review`
        const validationResponse = await fetch(validateSKUUrl, {
            method: "POST",
            body: formData
        });
        const skuJSON = await validationResponse.json();
        if (skuJSON.success) {
            setReviewDone(true)
            setLoading(false)
        }
    }

    if (loading)
        return (
            <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
                <Paper elevation={3} style={{ padding: "2rem", textAlign: "center" }}>
                    <CircularProgress />
                    <Typography variant="h4" gutterBottom>
                        Loading...
                    </Typography>
                </Paper>
            </Container>
        );

    return (
        <>
            <h2 style={{textAlign: 'center'}}>Make sure you have reviewed the attachment shared via mail before submitting your response.</h2>
            <Box mt={5} display="flex" justifyContent="center">
                <Box mx={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="small"
                        style={{ borderRadius: '50px', fontSize: '18px', fontWeight: '600', textTransform: 'none' }}
                        onClick={(e) => validateNewPO(e, true)}
                    >
                        Approve
                    </Button>
                </Box>
                <Box mx={2}>
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        size="small"
                        onClick={() => setDenyOpen(true)}
                        style={{ borderRadius: '50px', fontSize: '18px', fontWeight: '600', textTransform: 'none' }}
                    >
                        Reject
                    </Button>
                </Box>
            </Box>
            {denyOpen && (
                <Box mt={5} display="flex" justifyContent="center">
                    <Box mx={2} width="75%">
                        <TextField
                            autoFocus
                            margin="dense"
                            id="deny-reason"
                            label="Denial Reason"
                            type="text"
                            fullWidth
                            size="small"
                            multiline // Added multiline property
                            rows={4} // Added rows property
                            value={denyReason}
                            onChange={(e) => setDenyReason(e.target.value)}
                            style={{ borderRadius: '50px', fontSize: '18px', fontWeight: '600' }}
                        />
                    </Box>
                    <Box mx={2} display="flex" justifyContent="center" alignItems="center">
                        <Button
                            onClick={(e) => validateNewPO(e, false)}
                            color="primary"
                            fullWidth
                            size="small"
                            style={{ borderRadius: '50px', fontSize: '18px', fontWeight: '600', textTransform: 'none', width: '200px' }}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            )}
        </>
    );
};
