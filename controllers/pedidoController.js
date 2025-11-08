const pedidoRepository = require('../repository/pedido.repository');

class PedidoController {
  async listarTodos(req, res) {
    try {
      const pedidos = await pedidoRepository.findAll();

      const pedidosConTotal = pedidos.map(pedido => {
        const totalLineas = pedido.linea_pedido.reduce((acc, l) => acc + l.sub_total, 0);
        const precio_envio = pedido.localidad?.provincia?.costo_envio || 0;
        return { 
          ...pedido, 
          precio_total: totalLineas + precio_envio, 
          precio_envio 
        };
      });

      res.json(pedidosConTotal);
    } catch (error) {
      console.error('ERROR AL OBTENER PEDIDOS:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const nro_pedido = parseInt(req.params.id);
      const pedido = await pedidoRepository.findById(nro_pedido);

      if (!pedido) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }

      const totalLineas = pedido.linea_pedido.reduce((acc, l) => acc + l.sub_total, 0);
      const precio_envio = pedido.localidad?.provincia?.costo_envio || 0;
      const precio_total = totalLineas + precio_envio;

      res.json({ ...pedido, precio_total, precio_envio });
    } catch (error) {
      console.error('ERROR AL OBTENER PEDIDO:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async obtenerPorUsuario(req, res) {
    try {
      const nro_usuario = parseInt(req.params.nro_usuario);
      const pedidos = await pedidoRepository.findByUserId(nro_usuario);

const pedidosConTotal = [];

for (let i = 0; i < pedidos.length; i++) {
  const pedido = pedidos[i];
  
  // Sumar precio de cada una de las lineas
  let totalLineas = 0;
  for (let j = 0; j < pedido.linea_pedido.length; j++) {
    totalLineas = totalLineas + pedido.linea_pedido[j].sub_total;
  }
  
  // Obtener envío
  let precio_envio = 0;
  if (pedido.localidad && pedido.localidad.provincia) {
    precio_envio = pedido.localidad.provincia.costo_envio;
  }
  
  // Crear nuevo objeto
  const pedidoConTotal = {
    ...pedido,
    precio_total: totalLineas + precio_envio,
    precio_envio: precio_envio
  };
  
  pedidosConTotal.push(pedidoConTotal);
}

      res.json(pedidosConTotal);
    } catch (error) {
      console.error('ERROR AL OBTENER PEDIDOS DEL USUARIO:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async crear(req, res) { //hay validaciones que no se usan nunca ya que estan pensadas para un text box en el front, no las sacamos para no romper nada jeje
    const { id_metodo, nro_usuario, id_localidad, id_provincia, linea_pedido, direccion } = req.body;

    try {
      // Validaciones de entrada
      if (!id_metodo || !nro_usuario || !Array.isArray(linea_pedido) || linea_pedido.length === 0) {
        return res.status(400).json({ 
          error: 'id_metodo, nro_usuario y linea_pedido (no vacío) son obligatorios' 
        });
      }

      console.log('POST /pedidos body:', req.body);
      console.log('Dirección recibida:', direccion);

      // Validar usuario
      const usuario = await pedidoRepository.findUserById(Number(nro_usuario)); //devuelve la instancia User si la encuentra
      if (!usuario) { 
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Validar método de pago
      const metodo = await pedidoRepository.findMetodoPagoById(Number(id_metodo));
      if (!metodo) {
        return res.status(404).json({ error: 'Método de pago no encontrado' });
      }

      // Resolver localidad
      let localidad = null; //crea el objeto localidad vacio
      if (!id_localidad && id_provincia) {
        localidad = await pedidoRepository.findLocalidadByProvincia(Number(id_provincia));
        if (!localidad) {
          return res.status(404).json({ error: 'No hay localidades para la provincia indicada' });
        }
      } else {
        localidad = await pedidoRepository.findLocalidadById(Number(id_localidad)); //Se pasa como number al metodo
        if (!localidad) {
          return res.status(404).json({ error: 'Localidad no encontrada' });
        }
      }
      // de la 107 a la 110 investigar
      const id_localidad_usar = Number(id_localidad) || (localidad && localidad.id_localidad); // acá se usa la id_localidad como numero, no es lo mismo
      if (!id_localidad_usar) {
        return res.status(400).json({ error: 'No se pudo determinar la localidad para el pedido' });
      }
// Esta validacion si está bien

      // Validar stock antes de crear pedido
      for (const lp of linea_pedido) { //cada lp es el producto y la cantidad que componen el pedido total. En un pedido tengo distintos productos y distintas cantidades
        const articulo = await pedidoRepository.findArticuloById(Number(lp.id_articulo));
        
        if (!articulo) {
          return res.status(404).json({ error: `Artículo ${lp.id_articulo} no encontrado` });
          //el return te saca del flujo del for. Si no encuentra un articulo, no sigue con el for ni con nada, corta todo y devuelve el error
        }
        
        if (articulo.stock < Number(lp.cantidad)) {
          return res.status(400).json({ 
            error: `Stock insuficiente para ${articulo.nombre}. Disponible: ${articulo.stock}, solicitado: ${lp.cantidad}` 
          });
        }
      }

      // Validar artículos y recalcular subtotales
      let subtotal = 0;
      const lineasCreate = [];

      for (const lp of linea_pedido) {
        const articulo = await pedidoRepository.findArticuloById(Number(lp.id_articulo));
        const sub_total_calculado = Number(articulo.precio) * Number(lp.cantidad);
        subtotal += sub_total_calculado;
        lineasCreate.push({
          id_articulo: Number(lp.id_articulo),
          cantidad: Number(lp.cantidad),
          sub_total: sub_total_calculado
        });
      }

      const costo_envio = localidad.provincia?.costo_envio || 0;
      const precio_total = subtotal + costo_envio;

      // Crear pedido con relaciones anidadas
      const dataToCreate = {
        precio_total,
        direccion: direccion || '',
        usuario: { connect: { id: Number(nro_usuario) } },
        metodo_pago: { connect: { id_metodo: Number(id_metodo) } },
        localidad: { connect: { id_localidad: Number(id_localidad_usar) } },
        linea_pedido: {
          create: lineasCreate
        }
      };

      console.log('DATA a pasar a prisma.pedido.create:', JSON.stringify(dataToCreate, null, 2));

      const pedido = await pedidoRepository.create(dataToCreate);

      // Descontar stock después de crear pedido
      for (const lp of linea_pedido) {
        await pedidoRepository.updateArticuloStock(
          Number(lp.id_articulo), 
          Number(lp.cantidad)
        );
        console.log(`Stock actualizado para artículo ${lp.id_articulo}: -${lp.cantidad}`);
      }

      res.status(201).json(pedido);
    } catch (error) {
      console.error('ERROR AL CREAR PEDIDO:', error.stack || error);
      res.status(500).json({ 
        error: 'Error interno al crear pedido', 
        details: error.message 
      });
    }
  }

  async actualizar(req, res) {
    try {
      const nro_pedido = parseInt(req.params.id);
      const { id_metodo, id_localidad, linea_pedido } = req.body;

      // Verificar que el pedido existe
      const pedidoExistente = await pedidoRepository.findById(nro_pedido);
      if (!pedidoExistente) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }

      const localidad = await pedidoRepository.findLocalidadById(id_localidad);
      if (!localidad) {
        return res.status(404).json({ error: "Localidad no encontrada" });
      }

      const subtotal = (linea_pedido || []).reduce((acc, lp) => acc + lp.sub_total, 0);
      const costo_envio = localidad.provincia.costo_envio || 0;
      const precio_total = subtotal + costo_envio;

      const pedido = await pedidoRepository.update(nro_pedido, {
        id_metodo,
        id_localidad,
        precio_total
      });

      res.json(pedido);
    } catch (error) {
      console.error('ERROR AL ACTUALIZAR PEDIDO:', error);
      res.status(500).json({ error: 'Error al actualizar pedido' });
    }
  }

  async agregarEstado(req, res) {
    try {
      const nro_pedido = parseInt(req.params.id);
      const { descripcion } = req.body;

      if (!descripcion) {
        return res.status(400).json({ error: 'La descripción es obligatoria' });
      }

      // Verificar que el pedido existe
      const pedidoExistente = await pedidoRepository.findById(nro_pedido);
      if (!pedidoExistente) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }

      const estado = await pedidoRepository.createEstadoPedido({
        nro_pedido,
        descripcion
      });

      res.status(201).json(estado);
    } catch (error) {
      console.error('ERROR AL AGREGAR ESTADO:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async eliminar(req, res) {
    try {
      const nro_pedido = parseInt(req.params.id);

      // Verificar que el pedido existe
      const pedidoExistente = await pedidoRepository.findById(nro_pedido);
      if (!pedidoExistente) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }

      await pedidoRepository.delete(nro_pedido);
      res.json({ mensaje: 'Pedido eliminado' });
    } catch (error) {
      console.error('ERROR AL ELIMINAR PEDIDO:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PedidoController();