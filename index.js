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

const app = express(); //instancia de servidor web 

// Middlewares globales
app.use(cors()); // habilita CORS para que el front pueda llamar al back desde otro puerto
app.use(express.json()); // le digo que use los metodos de manejo de json en las peticiones "cuando te llegue algo del req.body si o si tiene que ser json"

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
app.use('/articulo_categoria', articuloCategoriaRoutes); //este metodo es redundando ya que las relaciones se manejan desde articulo y categoria


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}
);

// Middleware global de manejo de errores (último middleware)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && (err.stack || err)); //err.stack es la pila entera de error. Es mejor para debuguear
  res.status(500).json({ error: 'Internal Server Error' });
});
