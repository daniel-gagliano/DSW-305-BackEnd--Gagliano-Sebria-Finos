// levanto express y traigo los controllers
const express = require('express');
const usersController = require('./controllers/usersController');
const metodosController = require('./controllers/metodosController');
const categoriaController = require('./controllers/categoriaController');
const articuloController = require('./controllers/articuloController');
const localidadRouter = require('./controllers/localidadController');
const provinciaRouter = require('./controllers/provinciaController');
const descuentoRouter = require('./controllers/descuentoController');
const pedidoController = require('./controllers/pedidoController');
const articuloRoutes = require('./routes/articuloRoutes'); 
const articuloCategoriaController = require('./controllers/articuloCategoriaController');

const cors = require('cors');
const app = express();

// Middlewares globales
app.use(cors()); // habilita CORS para que el front pueda llamar al back desde otro puerto
app.use(express.json()); // parsea JSON en el body

// Ruteo: asocio la base path con cada controller
// Ej: todas las rutas definidas en usersController responden bajo /usuarios
app.use('/usuarios', usersController);
app.use('/metodos', metodosController);
app.use('/categorias', categoriaController);
app.use('/articulos', articuloController);
app.use('/localidades', localidadRouter);
app.use('/provincias', provinciaRouter);
app.use('/descuentos', descuentoRouter);
app.use('/pedidos', pedidoController);
app.use('/articulo_categoria', articuloCategoriaController);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}
);

// Middleware global de manejo de errores (último middleware)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && (err.stack || err));
  res.status(500).json({ error: 'Internal Server Error' });
});
