import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
      try {
          // Verificação se o nome de usuário e a senha não estão vazios
          if (username === '' && password === '') {
              return alert('Please, all fields are required.');
          }

          // Sending the data to API
          const response = await axios.post(
              'http://127.0.0.1:8000/api/v1/authentication/token/', {
              username: username,
              password: password,
          });
          console.log(response)

          if (response.status === 200) {
              const tokenData = response.data.access
              const refreshToken = response.data.refresh
              onLogin(tokenData, refreshToken)
          } else {
              alert('Login failed. Please, verify your credentials.');
          }
      } catch (error) {
          console.error('Login failed:', error.message);
          if (error.response && error.response.status === 401) {
              alert('Invalid credentials. Please, check your username and password.');
          } else {
              alert('Internal error. Please try again later.');
          }
      }
  };

  return (
    <div>
      <h2>Login</h2>
      <div className="p-2 mx-1">
        <label className="p-2">User: *</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="p-2 mx-1">
        <label className="p-2">Password: *</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;