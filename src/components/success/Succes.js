import { CheckCircleOutline } from "@mui/icons-material";
import { Container, Paper, Typography } from "@mui/material";

export default function Success(props) {
    return (
        <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
            <Paper
                elevation={3}
                style={{ padding: "2rem", textAlign: "center" }}
            >
                <CheckCircleOutline sx={{ fontSize: 100, color: "green" }} />
                <Typography variant="h4" gutterBottom>
                    {props.successTitle}
                </Typography>
                <Typography variant="body1">
                    {props.successBody}
                </Typography>
            </Paper>
        </Container>
    );
}
