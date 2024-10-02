// ItemList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardContent, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/pets/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(response)
        setItems(response.data);
      } catch (err) {
        setError('Erro ao buscar itens');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={{ marginTop: '20vh' }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Lista de Itens
      </Typography>
      <Button variant="contained" color="secondary" onClick={handleLogout} style={{ marginBottom: '1rem' }}>
        Logout
      </Button>
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ItemList;
