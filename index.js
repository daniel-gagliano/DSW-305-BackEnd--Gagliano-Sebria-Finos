const express = require('express');
const cors = require('cors');

// Importo las rutas 
const usersRoutes = require('./routes/user.routes');
const lineaPedidoRoutes = require('./routes/lineaPedido.routes');
const metodoPagoRoutes = require('./routes/metodoPago.routes');
const categoriaRoutes = require('./routes/categoria.routes');
const articuloRoutes = require('./routes/articulo.routes');
const localidadRoutes = require('./routes/localidad.routes');
const provinciaRoutes = require('./routes/provincia.routes');
const descuentoRoutes = require('./routes/descuento.routes');
const pedidoRoutes = require('./routes/pedido.routes');
const articuloCategoriaRoutes = require('./routes/articuloCategoria.routes');

const app = express();

// Middlewares globales
app.use(cors()); // habilita CORS para que el front pueda llamar al back desde otro puerto
app.use(express.json()); // parsea JSON en el body

// Ruteo
app.use('/usuarios', usersRoutes);
app.use('/metodos', metodoPagoRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/articulos', articuloRoutes);
app.use('/localidades', localidadRoutes);
app.use('/provincias', provinciaRoutes);
app.use('/descuentos', descuentoRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/linea_pedidos', lineaPedidoRoutes);
app.use('/articulo_categoria', articuloCategoriaRoutes);


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
