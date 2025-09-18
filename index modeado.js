const express = require('express');
const cors = require('cors');
const app = express();

// Importaciones de Controladores (mejor usar un nombre consistente)
const usersController = require('./controllers/usersController');
const metodosController = require('./controllers/metodosController');
const categoriaController = require('./controllers/categoriaController');
const articuloController = require('./controllers/articuloController');
const localidadController = require('./controllers/localidadController');
const provinciaController = require('./controllers/provinciaController');
const descuentoController = require('./controllers/descuentoController');
const pedidoController = require('./controllers/pedidoController');

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de la API (usando un prefijo /api)
// Nota: tus controladores deben exportar un router de Express.
// Si no lo hacen, deberás cambiar esto por app.get, app.post, etc.
app.use('/api/usuarios', usersController);
app.use('/api/metodos', metodosController);
app.use('/api/categorias', categoriaController);
app.use('/api/articulos', articuloController);
app.use('/api/localidades', localidadController);
app.use('/api/provincias', provinciaController);
app.use('/api/descuentos', descuentoController);
app.use('/api/pedidos', pedidoController);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    detalle: err.message,
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});