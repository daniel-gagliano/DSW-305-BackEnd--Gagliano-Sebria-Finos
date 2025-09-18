const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// =======================
// CREAR PEDIDO
// =======================

exports.createPedido = async (req, res, next) => {
  try {
    // Validar errores de express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    const { id_metodo, nro_usuario, id_localidad, linea_pedido } = req.body;

    // Calcular subtotales
    const subtotal = linea_pedido.reduce((acc, lp) => acc + lp.sub_total, 0);

    // Obtener costo de envío según provincia
    const localidad = await prisma.localidad.findUnique({
      where: { id_localidad },
      include: { provincia: true }
    });
    if (!localidad) {
      return res.status(404).json({ error: "Localidad no encontrada" });
    }

    const costo_envio = localidad.provincia.costo_envio || 0;
    const precio_total = subtotal + costo_envio;

    // Crear pedido con lineas
    const pedido = await prisma.pedido.create({
      data: {
        id_metodo,
        nro_usuario,
        id_localidad,
        precio_total,
        linea_pedido: {
          create: linea_pedido.map(lp => ({
            id_articulo: lp.id_articulo,
            cantidad: lp.cantidad,
            sub_total: lp.sub_total
          }))
        }
      },
      include: {
        linea_pedido: true,
        localidad: { include: { provincia: true } }
      }
    });

    res.status(201).json(pedido);
  } catch (error) {
    next(error); // se va al middleware global de errores
  }
};


// =======================
// LISTAR TODOS LOS PEDIDOS
// =======================
router.get('/', async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        linea_pedido: true,
        localidad: { include: { provincia: true } }
      }
    });

    const pedidosConTotal = pedidos.map(pedido => {
      const totalLineas = pedido.linea_pedido.reduce((acc, l) => acc + l.sub_total, 0);
      const precio_envio = pedido.localidad?.provincia?.costo_envio || 0;
      return { ...pedido, precio_total: totalLineas + precio_envio, precio_envio };
    });

    res.json(pedidosConTotal);
  } catch (error) {
    console.error('ERROR AL OBTENER PEDIDOS:', error);
    res.status(500).json({ error: error.message });
  }
});

// =======================
// OBTENER PEDIDO POR ID
// =======================
router.get('/:id', async (req, res) => {
  try {
    const pedido = await prisma.pedido.findUnique({
      where: { nro_pedido: parseInt(req.params.id) },
      include: {
        linea_pedido: true,
        localidad: { include: { provincia: true } }
      }
    });

    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });

    const totalLineas = pedido.linea_pedido.reduce((acc, l) => acc + l.sub_total, 0);
    const precio_envio = pedido.localidad?.provincia?.costo_envio || 0;
    const precio_total = totalLineas + precio_envio;

    res.json({ ...pedido, precio_total, precio_envio });
  } catch (error) {
    console.error('ERROR AL OBTENER PEDIDO:', error);
    res.status(500).json({ error: error.message });
  }
});

// =======================
// OBTENER PEDIDOS DE UN USUARIO
// =======================
router.get('/usuario/:nro_usuario', async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      where: { nro_usuario: parseInt(req.params.nro_usuario) },
      include: {
        linea_pedido: true,
        localidad: { include: { provincia: true } }
      }
    });

    const pedidosConTotal = pedidos.map(pedido => {
      const totalLineas = pedido.linea_pedido.reduce((acc, l) => acc + l.sub_total, 0);
      const precio_envio = pedido.localidad?.provincia?.costo_envio || 0;
      return { ...pedido, precio_total: totalLineas + precio_envio, precio_envio };
    });

    res.json(pedidosConTotal);
  } catch (error) {
    console.error('ERROR AL OBTENER PEDIDOS DEL USUARIO:', error);
    res.status(500).json({ error: error.message });
  }
});

// =======================
// ACTUALIZAR PEDIDO
// =======================

router.put('/:id', async (req, res) => {
  const { id_metodo, id_localidad, linea_pedido } = req.body;

  try {
    const localidad = await prisma.localidad.findUnique({
      where: { id_localidad },
      include: { provincia: true }
    });

    if (!localidad) {
      return res.status(404).json({ error: "Localidad no encontrada" });
    }

    const subtotal = (linea_pedido || []).reduce((acc, lp) => acc + lp.sub_total, 0);
    const costo_envio = localidad.provincia.costo_envio || 0;
    const precio_total = subtotal + costo_envio;

    const pedido = await prisma.pedido.update({
      where: { nro_pedido: parseInt(req.params.id) },
      data: {
        id_metodo,
        id_localidad,
        precio_total
      },
      include: {
        linea_pedido: true,
        localidad: { include: { provincia: true } }
      }
    });

    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar pedido' });
  }
});

// =======================
// AGREGAR ESTADO A UN PEDIDO
// =======================
router.post('/:id/estado', async (req, res) => {
  const { descripcion } = req.body;
  try {
    const estado = await prisma.estado_Pedido.create({
      data: {
        nro_pedido: parseInt(req.params.id),
        descripcion
      }
    });
    res.status(201).json(estado);
  } catch (error) {
    console.error('ERROR AL AGREGAR ESTADO:', error);
    res.status(500).json({ error: error.message });
  }
});

// =======================
// ELIMINAR PEDIDO
// =======================
router.delete('/:id', async (req, res) => {
  try {
    await prisma.pedido.delete({
      where: { nro_pedido: parseInt(req.params.id) }
    });
    res.json({ mensaje: 'Pedido eliminado' });
  } catch (error) {
    console.error('ERROR AL ELIMINAR PEDIDO:', error);
    res.status(500).json({ error: error.message });
  }
});


