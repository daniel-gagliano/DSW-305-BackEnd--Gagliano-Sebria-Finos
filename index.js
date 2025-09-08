const express = require('express');
const usersController = require('./CRUD/usersController');
const metodosController = require('./CRUD/metodosController');
const categoriaController = require('./CRUD/categoriaController');
const articuloController = require('./CRUD/articuloController');
const localidadRouter = require('./CRUD/localidadController');
const provinciaRouter = require('./CRUD/provinciaController');
const descuentoRouter = require('./CRUD/descuentoController');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/usuarios', usersController);
app.use('/metodos', metodosController);
app.use('/categorias', categoriaController);
app.use('/articulos', articuloController);
app.use('/localidades', localidadRouter);
app.use('/provincias', provinciaRouter);
app.use('/descuentos', descuentoRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}
);
