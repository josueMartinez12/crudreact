import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const ClientesCRUD = () => {
  const [clientes, setClientes] = useState([]);
  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);
  
  // Estado para el formulario
  const [form, setForm] = useState({
    nombreCompleto: '', email: '', telefono: '', ciudad: '', activo: true
  });

  // 1. OBTENER (GET)
  const cargarClientes = async () => {
    const res = await api.get('/clientes');
    setClientes(res.data);
  };

  useEffect(() => { cargarClientes(); }, []);

  // 2. MANEJAR INPUTS
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  // 3. GUARDAR (POST o PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editando) {
      await api.put(`/clientes/${idEditar}`, form);
      setEditando(false);
      setIdEditar(null);
    } else {
      await api.post('/clientes', form);
    }
    setForm({ nombreCompleto: '', email: '', telefono: '', ciudad: '', activo: true });
    cargarClientes();
  };

  // 4. ELIMINAR (DELETE)
  const eliminar = async (id) => {
    if(confirm("¿Borrar cliente?")) {
      await api.delete(`/clientes/${id}`);
      cargarClientes();
    }
  };

  // 5. PREPARAR EDICIÓN
  const prepararEdicion = (c) => {
    setEditando(true);
    setIdEditar(c.id);
    setForm({ ...c });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>CRUD Clientes - mabt30012026</h1>
      
      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} style={{ background: '#f4f4f4', padding: '15px', borderRadius: '8px' }}>
        <h3>{editando ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
        <input name="nombreCompleto" placeholder="Nombre" onChange={handleChange} value={form.nombreCompleto} required />
        <input name="email" placeholder="Email" onChange={handleChange} value={form.email} required />
        <input name="ciudad" placeholder="Ciudad" onChange={handleChange} value={form.ciudad} />
        <label>
          <input type="checkbox" name="activo" onChange={handleChange} checked={form.activo} /> Activo
        </label>
        <button type="submit">{editando ? 'Actualizar' : 'Guardar'}</button>
        {editando && <button onClick={() => {setEditando(false); setForm({nombreCompleto: '', email: '', ciudad: '', activo: true})}}>Cancelar</button>}
      </form>

      {/* TABLA */}
      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }} border="1">
        <thead>
          <tr>
            <th>Nombre</th><th>Email</th><th>Ciudad</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(c => (
            <tr key={c.id}>
              <td>{c.nombreCompleto}</td>
              <td>{c.email}</td>
              <td>{c.ciudad}</td>
              <td>
                <button onClick={() => prepararEdicion(c)}>✏️</button>
                <button onClick={() => eliminar(c.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientesCRUD;