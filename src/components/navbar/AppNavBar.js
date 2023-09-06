import { Link } from "react-router-dom";
import "./AppNavBar.css";
import { AppBar, Container, Toolbar, Typography } from "@mui/material";

export default function AppNavBar() {
    return (<AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link className="logo-container" to='/'>
            <img className="logo" src={`${process.env.PUBLIC_URL}/images/plugin-logo.png`} />
          </Link>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              display: 'block',
              fontFamily: 'sans-serif',
              fontWeight: 700,
              color: '#75bfb0',
              textDecoration: 'none',
              width: '90%',
              textAlign: 'center'
            }}
          >
            PURCHASE ORDER
          </Typography>
          <span className="right-space"></span>
        </Toolbar>
      </Container>
    </AppBar>)
}