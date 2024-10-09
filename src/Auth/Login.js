// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Alert, Box } from '@mui/material';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook para navegação após login

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Faz a requisição de login
      const response = await axios.post('http://localhost:3000/auth/login/', {
        login,
        password,
      });

      console.log(response.data)
      // Pega o token da resposta
      const token = response.data.token;

      // Armazena o token no localStorage
      localStorage.setItem('token', token);

      // Redireciona o usuário para a página de itens
      if(response.data.role == 'CLIENTE')
        navigate('/items');
      if(response.data.role == 'FUNCIONARIO')
        navigate('/servicos');
    } catch (err) {
      setError('Login ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '5rem' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>

      {error && (
        <Alert severity="error" style={{ marginBottom: '1rem' }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleLogin} noValidate>
        <TextField
          label="Login"
          variant="outlined"
          fullWidth
          margin="normal"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        <TextField
          label="Senha"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '1.5rem' }}
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
