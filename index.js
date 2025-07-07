const express = require('express');
const usersController = require('./usersController');
const metodosController = require('./metodosController');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/usuarios', usersController);
app.use('/metodos', metodosController);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
