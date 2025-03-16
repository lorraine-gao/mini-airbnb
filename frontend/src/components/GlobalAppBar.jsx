import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const GlobalAppBar = (props) => {
  const navigate = useNavigate();

  const logout = () => {
    props.setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    navigate('/');
  }

  return (
    <AppBar position="static">
      <Toolbar data-testid="appbar-toolbar">
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Airbrb
        </Typography>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}><Button color="inherit" id="bar-landing-button">Landing Page</Button></Link>
        {localStorage.getItem('token')
          ? <>
            <Link to="/host" style={{ textDecoration: 'none', color: 'inherit' }}><Button color="inherit" id="bar-host-button">Hosted Listing</Button></Link>
            <Button color="inherit" onClick={logout} id="bar-logout-button">Logout</Button>
            </>
          : <>
            <Link to="/register" style={{ textDecoration: 'none', color: 'inherit' }}><Button color="inherit" id="bar-register-button">Register</Button></Link>
            <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}><Button color="inherit" id="bar-login-button">Login</Button></Link>
            </>
        }
      </Toolbar>
    </AppBar>
  );
}

export default GlobalAppBar;
