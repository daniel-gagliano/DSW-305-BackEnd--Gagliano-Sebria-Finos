const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let metodos_pago = [];
let contadorID = 1;

app.post('/metodos', (req, res) => {
  const { descripcion } = req.body;
  if (!descripcion) return res.status(400).json({ error: 'La descripción es obligatoria' });

  const nuevoMetodo = { id_metodo: contadorID++, descripcion };
  metodos_pago.push(nuevoMetodo);
  res.status(201).json(nuevoMetodo);
});

app.get('/metodos', (req, res) => res.json(metodos_pago));

app.get('/metodos/:id', (req, res) => {
  const metodo = metodos_pago.find(m => m.id_metodo === parseInt(req.params.id));
  if (!metodo) return res.status(404).json({ error: 'Método no encontrado' });
  res.json(metodo);
});

app.put('/metodos/:id', (req, res) => {
  const { descripcion } = req.body;
  const metodo = metodos_pago.find(m => m.id_metodo === parseInt(req.params.id));
  if (!metodo) return res.status(404).json({ error: 'Método no encontrado' });
  if (!descripcion) return res.status(400).json({ error: 'La descripción es obligatoria' });

  metodo.descripcion = descripcion;
  res.json(metodo);
});

app.delete('/metodos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = metodos_pago.findIndex(m => m.id_metodo === id);
  if (index === -1) return res.status(404).json({ error: 'Método no encontrado' });

  metodos_pago.splice(index, 1);
  res.json({ mensaje: 'Método eliminado correctamente' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
