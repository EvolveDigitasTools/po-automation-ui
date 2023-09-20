import { Link } from "react-router-dom";
import "./AppNavBar.css";
import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function AppNavBar() {
  const [title, setTitle] = useState("");
  useEffect(() => {
    if(window.location.pathname == "/")
    setTitle("VENDOR REGISTRATION")
    else
    setTitle("PURCHASE ORDER");
  }, []);
  
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
          {title}
        </Typography>
        <span className="right-space"></span>
      </Toolbar>
    </Container>
  </AppBar>)
}