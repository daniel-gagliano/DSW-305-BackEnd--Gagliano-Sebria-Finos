const lineaPedidoRepository = require('../repository/lineaPedido.repository');

class LineaPedidoController {
  async listarTodas(req, res) {
    try {
      const { nro_pedido } = req.query;
      const filters = nro_pedido ? { nro_pedido: Number(nro_pedido) } : {};
      
      const lineas = await lineaPedidoRepository.findAll(filters);
      res.json(lineas);
    } catch (error) {
      console.error('ERROR AL OBTENER LÍNEAS:', error);
      res.status(500).json({ error: 'Error al obtener líneas de pedido' });
    }
  }

  async obtenerPorIds(req, res) {
    try {
      const nro_pedido = Number(req.params.nro_pedido);
      const id_articulo = Number(req.params.id_articulo);
      
      const linea = await lineaPedidoRepository.findByIds(nro_pedido, id_articulo);
      
      if (!linea) {
        return res.status(404).json({ error: 'Línea no encontrada' });
      }
      
      res.json(linea);
    } catch (error) {
      console.error('ERROR AL OBTENER LÍNEA:', error);
      res.status(500).json({ error: 'Error al obtener línea de pedido' });
    }
  }

  async crear(req, res) {
    try {
      const { nro_pedido, id_articulo, cantidad } = req.body;

      // Validaciones
      if (!nro_pedido || !id_articulo || !cantidad) {
        return res.status(400).json({ 
          error: 'nro_pedido, id_articulo y cantidad son obligatorios' 
        });
      }

      if (cantidad <= 0) {
        return res.status(400).json({ 
          error: 'La cantidad debe ser mayor a 0' 
        });
      }

      // Verificar que el pedido existe
      const pedido = await lineaPedidoRepository.findPedidoById(Number(nro_pedido));
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }

      // Verificar que el artículo existe
      const articulo = await lineaPedidoRepository.findArticuloById(Number(id_articulo));
      if (!articulo) {
        return res.status(404).json({ error: 'Artículo no encontrado' });
      }

      // Verificar stock disponible
      if (articulo.stock < cantidad) {
        return res.status(400).json({ 
          error: `Stock insuficiente. Disponible: ${articulo.stock}` 
        });
      }

      // Verificar que la línea no exista ya
      const lineaExistente = await lineaPedidoRepository.findByIds(
        Number(nro_pedido),
        Number(id_articulo)
      );
      
      if (lineaExistente) {
        return res.status(400).json({ 
          error: 'Esta línea de pedido ya existe' 
        });
      }

      // Calcular subtotal
      const sub_total = articulo.precio * cantidad;

      const linea = await lineaPedidoRepository.create({
        nro_pedido: Number(nro_pedido),
        id_articulo: Number(id_articulo),
        cantidad: Number(cantidad),
        sub_total
      });

      res.status(201).json(linea);
    } catch (error) {
      console.error('ERROR AL CREAR LÍNEA:', error);
      res.status(500).json({ 
        error: 'Error al crear línea de pedido',
        details: error.message 
      });
    }
  }

  async actualizar(req, res) {
    try {
      const nro_pedido = Number(req.params.nro_pedido);
      const id_articulo = Number(req.params.id_articulo);
      const { cantidad } = req.body;

      // Validaciones
      if (!cantidad || cantidad <= 0) {
        return res.status(400).json({ 
          error: 'La cantidad debe ser mayor a 0' 
        });
      }

      // Verificar que la línea existe
      const lineaExistente = await lineaPedidoRepository.findByIds(nro_pedido, id_articulo);
      if (!lineaExistente) {
        return res.status(404).json({ error: 'Línea no encontrada' });
      }

      // Verificar que el artículo existe
      const articulo = await lineaPedidoRepository.findArticuloById(id_articulo);
      if (!articulo) {
        return res.status(404).json({ error: 'Artículo no encontrado' });
      }

      // Verificar stock disponible
      if (articulo.stock < cantidad) {
        return res.status(400).json({ 
          error: `Stock insuficiente. Disponible: ${articulo.stock}` 
        });
      }

      // Calcular nuevo subtotal
      const sub_total = articulo.precio * cantidad;

      const linea = await lineaPedidoRepository.update(nro_pedido, id_articulo, {
        cantidad: Number(cantidad),
        sub_total
      });

      res.json(linea);
    } catch (error) {
      console.error('ERROR AL ACTUALIZAR LÍNEA:', error);
      res.status(500).json({ 
        error: 'Error al actualizar línea',
        details: error.message 
      });
    }
  }

  async eliminar(req, res) {
    try {
      const nro_pedido = Number(req.params.nro_pedido);
      const id_articulo = Number(req.params.id_articulo);

      // Verificar que la línea existe
      const lineaExistente = await lineaPedidoRepository.findByIds(nro_pedido, id_articulo);
      if (!lineaExistente) {
        return res.status(404).json({ error: 'Línea no encontrada' });
      }

      await lineaPedidoRepository.delete(nro_pedido, id_articulo);
      res.json({ mensaje: 'Línea eliminada correctamente' });
    } catch (error) {
      console.error('ERROR AL ELIMINAR LÍNEA:', error);
      res.status(500).json({ 
        error: 'Error al eliminar línea',
        details: error.message 
      });
    }
  }
}

module.exports = new LineaPedidoController();