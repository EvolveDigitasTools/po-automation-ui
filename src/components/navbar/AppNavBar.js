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
              m: 'auto',
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'sans-serif',
              fontWeight: 700,
              color: '#75bfb0',
              textDecoration: 'none',
            }}
          >
            PURCHASE ORDER
          </Typography>
          <img style={{ visibility: 'hidden' }} className="logo" src={`${process.env.PUBLIC_URL}/images/plugin-logo.png`} />
        </Toolbar>
      </Container>
    </AppBar>)
}