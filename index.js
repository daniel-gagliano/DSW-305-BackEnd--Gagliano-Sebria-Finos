const express = require('express');
const usersController = require('./usersController');
const metodosController = require('./metodosController');
const categoriaController = require('./categoriaController');
const articuloController = require('./articuloController');
const localidadRouter = require('./localidadController');
const provinciaRouter = require('./provinciaController');
const descuentoRouter = require('./descuentoController');
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
