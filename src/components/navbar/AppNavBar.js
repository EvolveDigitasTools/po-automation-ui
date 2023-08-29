import "./AppNavBar.css";
import { AppBar, Container, Toolbar, Typography } from "@mui/material";

export default function AppNavBar() {
    return (<AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img className="logo" src={`${process.env.PUBLIC_URL}/images/plugin-logo.png`} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            PO Automation Tool
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>)
}