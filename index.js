const express = require('express');
const usersController = require('./controllers/usersController');
const metodosController = require('./controllers/metodosController');
const categoriaController = require('./controllers/categoriaController');
const articuloController = require('./controllers/articuloController');
const localidadRouter = require('./controllers/localidadController');
const provinciaRouter = require('./controllers/provinciaController');
const descuentoRouter = require('./controllers/descuentoController');
const pedidoController = require('./controllers/pedidoController');

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
app.use('/pedidos', pedidoController);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}
);
