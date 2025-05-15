const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require("./db");

// 14.5 implementado nodemon para correr el servidor cada vez que se guarda automaticamente

app.use(cors());
app.use(express.json());

let metodos_pago = []; // array anterior para guardar en memoria
let contadorID = 1;

app.post('/metodos', (req, res) => {
  const { desc_metodo } = req.body;
  if (!desc_metodo) return res.status(400).json({ error: 'La descripción es obligatoria' });

  //const nuevoMetodo = { id_metodo: contadorID++, desc_metodo };
  // de esta maenra se guarda solamente en memoria -> metodos_pago.push(nuevoMetodo);
  console.log(desc_metodo)
  mysql.query("insert into metodo_pago (desc_metodo) values (?)", desc_metodo , (error, results) => {
      console.log(error)
      res.send("Valor ingresado exitosamente")
  })
  // res.status(201).json(nuevoMetodo); ya devolvemos el valor en la linea 19
});


// app.get('/metodos', (req, res) => res.json(metodos_pago));

app.get('/metodos', (req, res) => {
  mysql.query("select * from metodo_pago", (error, results) => {
    res.json(results)
  })
});

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
