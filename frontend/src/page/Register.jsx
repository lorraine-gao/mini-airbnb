import React from 'react';
import { useNavigate } from 'react-router-dom';

import RegisterForm from '../components/RegisterForm';

const Register = (props) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const navigate = useNavigate();

  const register = async () => {
    if (password !== confirmPassword) {
      alert('The two passwords do not match.');
      return;
    }

    const response = await fetch('http://localhost:5005/user/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email, password, name
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
      <RegisterForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        name={name}
        setName={setName}
        register={register}
    />
    </>
  )
}

export default Register;
