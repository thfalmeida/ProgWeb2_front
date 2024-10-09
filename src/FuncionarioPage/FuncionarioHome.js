import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, TextField, Button, List, ListItem, ListItemText, IconButton, 
  Dialog, DialogActions, DialogContent, DialogTitle, 
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add'
import axios from 'axios'; // Importação do Axios

const FuncionarioPage = () => {
const navigate = useNavigate(); // Hook para navegação após login
  const [items, setItems] = useState([]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDescription, setNewServiceDescription] = useState('');
  const [newServicePrice, setNewServicePrice] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [editingValue, setEditingValue] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogNewService, setDialogNewService] = useState(false)
  const [servicosDisponiveis, setServicoDisponiveis] = useState([]);


  const fetchServicos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/servicos/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data)
      setServicoDisponiveis(response.data);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
    }
  }

  // Função para adicionar um novo item
  const addItem = async () => {
    console.log("Salvando servico")
    if (newServiceName.trim() === '') return;

    try {
    console.log("Tentando salvar servico")
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/servicos/', {nome: newServiceName, valor: parseFloat(newServicePrice), descricao: newServiceDescription }, {headers: { Authorization: `Bearer ${token}` }});
      setItems([...items, response.data]); // Adiciona o item retornado pela API
      setNewServiceName(''); // Limpa o campo de entrada
    setNewServicePrice(0)
    setNewServiceDescription("");
    setDialogNewService(false)
    await fetchServicos();
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  };

  // Função para excluir um item
  const deleteItem = async (index, itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/servicos/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);
      await fetchServicos();
    } catch (error) {
      console.error('Erro ao excluir item:', error);
    }
  };

  // Função para editar um item
  const saveEdit = async () => {
    try {
      const id = servicosDisponiveis[editingIndex].id
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/servicos/${id}`, {nome: editingName, valor: parseFloat(editingValue), descricao: editingDescription }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingIndex(null);
      setEditingName('');
      setEditingDescription("");
      setEditingValue(0)
      await fetchServicos();
      setOpenDialog(false); // Fecha o modal de edição
      
    } catch (error) {
      console.error('Erro ao editar item:', error);
    }
  };

  // Inicia a edição de um item
  const editItem = (index, currentName, currentDescription, currentValue) => {
    setEditingIndex(index);
    setEditingDescription(currentDescription);
    setEditingValue(currentValue)
    setEditingName(currentName);
    setOpenDialog(true); // Abre o modal de edição
  };

  
  const handleLogout = () => {
    console.log("Deslogando")
    localStorage.removeItem('token');
    navigate('/login');
  };



  // UseEffect para buscar os itens quando o componente carregar
  useEffect(() => {
    fetchServicos();
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" component="h3" align="center" gutterBottom>
        PetCare
      </Typography>
      <Typography variant="h4" component="h4" align="center" gutterBottom>
        Cuidado do seu pet
      </Typography>

      <Typography variant="h4" component="h4" align="center" gutterBottom>
        Servicos disponiveis
      </Typography>


      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => setDialogNewService(true)}
        sx={{ mb: 3 }}
      >
        Cadastrar novo servico
      </Button>

      {/* Lista de servicos */}
      <List>
          {servicosDisponiveis && servicosDisponiveis.length > 0 ? servicosDisponiveis.map((item, index) => (
            <ListItem key={item.id}>
              <ListItemText primary={item.nome} />
              <ListItemText primary={item.descricao} />
              <ListItemText primary={item.valor} />
                <IconButton edge="end" aria-label="editar" onClick={() => editItem(index, item.nome, item.descricao, item.valor)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="excluir" onClick={() => deleteItem(index, item.id)}>
                  <DeleteIcon />
                </IconButton>
            </ListItem>
          )) : <Typography>Nenhum pet cadastrado</Typography>}
        </List>


      {/* Modal de edição */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Editar Servico</DialogTitle>
        <DialogContent>
          <TextField
            label="Editar nome"
            variant="outlined"
            fullWidth
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
          />
        <TextField
            label="Editar descricao"
            variant="outlined"
            fullWidth
            value={editingDescription}
            onChange={(e) => setEditingDescription(e.target.value)}
          />
        <TextField
            label="Editar valor"
            variant="outlined"
            fullWidth
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={saveEdit} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

    {/* Cadastrar novo servico*/}
      <Dialog open={openDialogNewService} onClose={() => setDialogNewService(false)}>
      <DialogTitle>Cadastrar novo servico</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            variant="outlined"
            fullWidth
            value={newServiceName}
            onChange={(e) => setNewServiceName(e.target.value)}
            margin="normal"
          />
        <TextField
            label="Descricao"
            variant="outlined"
            fullWidth
            value={newServiceDescription}
            onChange={(e) => setNewServiceDescription(e.target.value)}
            margin="normal"
          />
        <TextField
            label="preco"
            variant="outlined"
            fullWidth
            value={newServicePrice}
            onChange={(e) => setNewServicePrice(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogNewService(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={addItem} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
      <Button onClick={handleLogout}>
        Deslogar
      </Button>
    </Container>
  );
};

export default FuncionarioPage;
