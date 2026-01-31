import axios from 'axios';

const api = axios.create({
  baseURL: 'https://697d684f97386252a2681e8c.mockapi.io/Clientes' 
});

export default api;