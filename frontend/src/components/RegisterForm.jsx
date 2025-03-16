import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const RegisterForm = ({
  email, setEmail,
  password, setPassword,
  confirmPassword, setConfirmPassword,
  name, setName,
  register
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2} // 设置间隔
    >
      <Typography variant="h3">
        Register
      </Typography>
      <TextField
        id="outlined-email"
        label="Email"
        variant="outlined"
        type="text"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <TextField
        id="outlined-password"
        label="Password"
        variant="outlined"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <TextField
        id="outlined-confirm-password"
        label="Confirm password"
        variant="outlined"
        type="password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
      />
      <TextField
        id="outlined-name"
        label="Name"
        variant="outlined"
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <Button
        id = "register-button"
        variant="contained"
        color="primary"
        onClick={register}
      >
        Register
      </Button>
    </Box>
  );
};

export default RegisterForm;
