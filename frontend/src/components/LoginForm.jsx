import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const LoginForm = ({ email, setEmail, password, setPassword, login }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={3}
    >
    <Typography variant="h3">
      Login
    </Typography>
    <TextField
      id="outlined-basic-email"
      label="Email"
      variant="outlined"
      type="text"
      value={email}
      onChange={e => setEmail(e.target.value)}
    />
    <TextField
      id="outlined-basic-password"
      label="Password"
      variant="outlined"
      type="password"
      value={password}
      onChange={e => setPassword(e.target.value)}
      />
      <Button
        id="login-button"
        variant="contained"
        color="primary"
        onClick={login}
      >
      Login
      </Button>
      </Box>
  );
};

export default LoginForm;
