import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const ClientesCRUD = () => {
  const [clientes, setClientes] = useState([]);
  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);
  
  const [form, setForm] = useState({
    nombreCompleto: '', email: '', telefono: '', ciudad: '', activo: true
  });

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    try {
      const res = await api.get('/clientes');
      setClientes(res.data);
    } catch (err) {
      console.error("Error al obtener datos");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  // --- FUNCIÓN UNIFICADA (GUARDAR O ACTUALIZAR) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        // Lógica de Actualizar (PUT)
        await api.put(`/clientes/${idEditar}`, form);
        setEditando(false);
        setIdEditar(null);
      } else {
        // Lógica de Crear (POST)
        await api.post('/clientes', form);
      }
      setForm({ nombreCompleto: '', email: '', telefono: '', ciudad: '', activo: true });
      obtenerClientes();
    } catch (error) {
      alert("Error en la operación");
    }
  };

  const eliminarCliente = async (id) => {
    if (window.confirm("¿Desea eliminar este registro?")) {
      await api.delete(`/clientes/${id}`);
      obtenerClientes();
    }
  };

  // --- PREPARAR LA EDICIÓN ---
  const prepararEdicion = (c) => {
    setEditando(true);
    setIdEditar(c.id);
    setForm({
      nombreCompleto: c.nombreCompleto,
      email: c.email,
      telefono: c.telefono,
      ciudad: c.ciudad,
      activo: c.activo
    });
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#203e5a', marginBottom: '25px' }}>
        Gestión de Clientes - Alias: jiam30012026
      </h2>

      {/* Formulario Estilo Captura */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <input name="nombreCompleto" placeholder="Nombre" onChange={handleChange} value={form.nombreCompleto} style={inputStyle} required />
        <input name="email" placeholder="Email" onChange={handleChange} value={form.email} style={inputStyle} required />
        <input name="telefono" placeholder="Teléfono" onChange={handleChange} value={form.telefono} style={inputStyle} />
        <input name="ciudad" placeholder="Ciudad" onChange={handleChange} value={form.ciudad} style={inputStyle} />
        
        <button type="submit" style={{...btnStyle, backgroundColor: editando ? '#e3f2fd' : '#fff'}}>
          {editando ? 'Actualizar Cliente' : 'Agregar Cliente'}
        </button>
        
        {editando && (
          <button type="button" onClick={() => {setEditando(false); setForm({nombreCompleto:'', email:'', telefono:'', ciudad:'', activo:true})}} style={{...btnStyle, marginLeft: '5px'}}>
            Cancelar
          </button>
        )}
      </form>

      {/* Tabla con Bordes Marcados */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerCellStyle}>Nombre</th>
            <th style={headerCellStyle}>Email</th>
            <th style={headerCellStyle}>Ciudad</th>
            <th style={headerCellStyle}>Estado</th>
            <th style={headerCellStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id}>
              <td style={bodyCellStyle}>{c.nombreCompleto}</td>
              <td style={bodyCellStyle}>{c.email}</td>
              <td style={bodyCellStyle}>{c.ciudad}</td>
              <td style={bodyCellStyle}>
                <input type="checkbox" checked={c.activo} readOnly style={{ accentColor: '#76d7a2' }} />
              </td>
              <td style={bodyCellStyle}>
                <button onClick={() => prepararEdicion(c)} style={actionBtnStyle}>Editar</button>
                <button onClick={() => eliminarCliente(c.id)} style={{...actionBtnStyle, marginLeft: '5px'}}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- ESTILOS REPLICADOS ---
const inputStyle = { border: '1px solid #7a7a7a', padding: '8px', width: '180px', outline: 'none' };
const btnStyle = { marginLeft: '10px', padding: '10px 15px', border: '1px solid #d1d1d1', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', border: '1px solid #7a7a7a' };
const headerCellStyle = { border: '1px solid #7a7a7a', padding: '12px', textAlign: 'left' };
const bodyCellStyle = { border: '1px solid #7a7a7a', padding: '15px' };
const actionBtnStyle = { backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '5px 15px', cursor: 'pointer' };

export default ClientesCRUD;