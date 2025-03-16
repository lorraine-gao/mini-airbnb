import React from 'react';
import { useNavigate } from 'react-router-dom';

import LoginForm from '../components/LoginForm';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005';

const Login = (props) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  const login = async () => {
    const response = await fetch(`${API_BASE_URL}/user/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email, password
      }),
      headers: {
        'Content-type': 'application/json',
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('name', email);
      props.setToken(data.token);
      navigate('/');
    }
  };

  return (
    <>
      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        login={login}
      />
    </>
  )
}

export default Login;
