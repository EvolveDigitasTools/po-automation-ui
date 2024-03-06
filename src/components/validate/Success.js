import { CheckCircleOutline } from "@mui/icons-material";
import { Paper, Typography } from "@mui/material";
import { Container } from "@mui/system";
// import { Link } from "react-router-dom";

export default function Success() {
    return (
        <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
            <Paper
                elevation={3}
                style={{ padding: "2rem", textAlign: "center" }}
            >
                <CheckCircleOutline sx={{ fontSize: 100, color: "green" }} />
                <Typography variant="h4" gutterBottom>
                    Submission Successful
                </Typography>
                <Typography variant="body1">
                    Your registration is succesful, you can contact our team for
                    purchase order.
                </Typography>
                {/* <Link to="/">
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "1rem" }}
                    >
                        Go Back
                    </Button>
                </Link> */}
            </Paper>
        </Container>
    );
}
