// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Auth/Login';
import ItemList from './ClientePage/ClienteHome';

// Função para verificar se o usuário está autenticado (se o token existe)
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Componente de rota protegida
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rota da tela de login */}
        <Route path="/login" element={<Login />} />
        
        {/* Rota protegida para a lista de itens */}
        <Route
          path="/items"
          element={
            <PrivateRoute>
              <ItemList />
            </PrivateRoute>
          }
        />

        {/* Redireciona para login por padrão */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
