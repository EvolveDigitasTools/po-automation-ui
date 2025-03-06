import { CircularProgress, Container, Paper, Typography } from "@mui/material";

export default function Loading() {
    return (
        <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
            <Paper
                elevation={3}
                style={{ padding: "2rem", textAlign: "center" }}
            >
                <CircularProgress />
                <Typography variant="h4" gutterBottom>
                    Loading...
                </Typography>
            </Paper>
        </Container>
    );
}
