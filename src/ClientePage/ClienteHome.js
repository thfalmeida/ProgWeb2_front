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

const ItemList = () => {
  const navigate = useNavigate(); // Hook para navegação após login
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogNewPet, setDialogNewPet] = useState(false)
  const [servicosContratados, setServicosContratados] = useState([]);
  const [servicoContratadoPetId, setServicoContratadoPetId] = useState(null)
  const [servicosDisponiveis, setServicoDisponiveis] = useState([]);
  const [openDialogServicos, setDialogServicos] = useState(false)
  const [novoPedidoPetId, setNovoPedidoPetId] = useState(null)
  const [novoPedidoServicoId, setNovoPedidoServicoId] = useState(null)

  // Função para buscar os itens do servidor
  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/pets/client', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(response.data); 
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
    }
  };

  const fetchServicos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/servicos/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServicoDisponiveis(response.data);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
    }
  }

  const fetchServicosContratados = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/servicoContratado/cliente/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServicosContratados(response.data);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
    }
  }

  const addPedido = async (servicoId) => {
    try {
      const token = localStorage.getItem('token');
      const body = {petId: novoPedidoPetId, servicoId: novoPedidoServicoId  };
      console.log(body)
      const response = await axios.post('http://localhost:3000/servicoContratado/', {petId: novoPedidoPetId, servicoId: servicoId  }, {headers: { Authorization: `Bearer ${token}` }});
      setDialogServicos(false)
      await fetchServicosContratados();
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  };

  const deletePedido = async (pedidoId) => {
    try {
      const token = localStorage.getItem('token');
      const body = {petId: novoPedidoPetId, servicoId: novoPedidoServicoId  };
      const response = await axios.delete(`http://localhost:3000/servicoContratado/${pedidoId}`, {headers: { Authorization: `Bearer ${token}` }});
      await fetchServicosContratados();
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  }

  // Função para adicionar um novo item
  const addItem = async () => {
    if (newItemName.trim() === '') return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/pets/', {nome: newItemName }, {headers: { Authorization: `Bearer ${token}` }});
      setItems([...items, response.data]); // Adiciona o item retornado pela API
      setNewItemName(''); // Limpa o campo de entrada
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  };

  // Função para excluir um item
  const deleteItem = async (index, itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/pets/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);
      await fetchItems();
    } catch (error) {
      console.error('Erro ao excluir item:', error);
    }
  };

  // Função para editar um item
  const saveEdit = async () => {
    try {
      const id = items[editingIndex].id
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/pets/${id}`, {nome: editingName }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedItems = [...items];
      updatedItems[editingIndex].name = editingName;
      setItems(updatedItems);
      setEditingIndex(null);
      setEditingName('');
      setOpenDialog(false); // Fecha o modal de edição
      await fetchItems();
    } catch (error) {
      console.error('Erro ao editar item:', error);
    }
  };

  // Inicia a edição de um item
  const editItem = (index, currentName) => {
    setEditingIndex(index);
    setEditingName(currentName);
    setOpenDialog(true); // Abre o modal de edição
  };

  const handleLogout = () => {
    console.log("Deslogando")
    localStorage.removeItem('token');
    navigate('/login');
  };

  const solicitarPedido = (index) => {
    setNovoPedidoPetId(index);
    setDialogServicos(true);
  }

  const newPedidoHandler = (servicoId) => {
    console.log("Id do servico: " + servicoId)
    setNovoPedidoServicoId(servicoId)
    addPedido(servicoId);
  }

  const closeDialogServiceFunc = () => {

  }

  // UseEffect para buscar os itens quando o componente carregar
  useEffect(() => {
    fetchItems();
    fetchServicos();
    fetchServicosContratados();
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
        Pets
      </Typography>


      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => setDialogNewPet(true)}
        sx={{ mb: 3 }}
      >
        Cadastrar novo pet
      </Button>

      {/* Lista de pets */}
      <List>
        {items && items.length > 0 ? items.map((item, index) => (
          <ListItem key={item.id}>
            <ListItemText primary={item.nome} />
            <IconButton edge="end" aria-label="Addservico" onClick={() => solicitarPedido(item.id)}>
                <AddIcon />
              </IconButton>
              <IconButton edge="end" aria-label="editar" onClick={() => editItem(index, item.nome)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="excluir" onClick={() => deleteItem(index, item.id)}>
                <DeleteIcon />
              </IconButton>
          </ListItem>
        )) : <Typography>Nenhum pet cadastrado</Typography>}
      </List>

      <Typography variant="h5" component="h5" align="center" gutterBottom>
        Serviços solicitados
      </Typography>
      {/* Lista de pets */}
      <List>
        {servicosContratados && servicosContratados.length > 0 ? servicosContratados.map((item, index) => (
          <ListItem key={item.id}>
            <ListItemText primary={item.pet.nome} />
            <ListItemText primary={item.servico.nome} />
            <ListItemText primary={item.servico.valor} />
              <IconButton edge="end" aria-label="excluir" onClick={() => deletePedido(item.id)}>
                <DeleteIcon />
              </IconButton>
          </ListItem>
        )) : <Typography>Nenhum pet cadastrado</Typography>}
      </List>

      {/* Servicos disponiveis para serem contratados*/}
      <Dialog open={openDialogServicos} onClose={() => setDialogServicos(false)}>
        <DialogTitle>Serviços disponíveis</DialogTitle>
        <DialogContent>
        <List>
          {servicosDisponiveis && servicosDisponiveis.length > 0 ? servicosDisponiveis.map((item, index) => (
            <ListItem key={item.id}>
              <ListItemText  primary={item.nome} />
              <ListItemText  primary={item.descricao} />
              <ListItemText  primary={item.valor} />
              <IconButton edge="end" aria-label="Addservico" onClick={() =>  newPedidoHandler(item.id)}>
                  <AddIcon />
                </IconButton>
            </ListItem>
          )) : <Typography>Nenhum servico disponível para contratação</Typography>}
        </List>
        </DialogContent>
        <DialogActions>
          <Button color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de edição */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Editar Pet</DialogTitle>
        <DialogContent>
          <TextField
            label="Editar nome"
            variant="outlined"
            fullWidth
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
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

      <Dialog open={openDialogNewPet} onClose={() => setDialogNewPet(false)}>
      <DialogTitle>Novo Pet</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome do pet"
            variant="outlined"
            fullWidth
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogNewPet(false)} color="secondary">
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

export default ItemList;
