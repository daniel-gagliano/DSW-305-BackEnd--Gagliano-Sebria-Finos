const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// =======================
// CREAR PEDIDO
// =======================
router.post('/', async (req, res) => {
  const { id_metodo, nro_usuario, id_localidad, linea_pedido } = req.body;
  const lineas = linea_pedido || [];

  try {
    // Traer precio_envio de la provincia
    const localidad = await prisma.localidad.findUnique({
      where: { id_localidad },
      include: { provincia: true }
    });
    const precio_envio = localidad?.provincia?.costo_envio || 0;

    // Calcular total de las líneas + envío
    const totalLineas = lineas.reduce((acc, l) => acc + l.sub_total, 0);
    const precio_total = totalLineas + precio_envio;

    const pedido = await prisma.pedido.create({
      data: {
        id_metodo,
        nro_usuario,
        id_localidad,
        precio_total,
        linea_pedido: {
          create: lineas.map(lp => ({
            id_articulo: lp.id_articulo,
            cantidad: lp.cantidad,
            sub_total: lp.sub_total
          }))
        }
      },
      include: { linea_pedido: true }
    });

    res.status(201).json({ ...pedido, precio_envio });
  } catch (error) {
    console.error('ERROR AL CREAR PEDIDO:', error);
    res.status(500).json({ error: error.message });
  }
});

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
  const lineas = linea_pedido || [];

  try {
    // Traer precio_envio
    const localidad = await prisma.localidad.findUnique({
      where: { id_localidad },
      include: { provincia: true }
    });
    const precio_envio = localidad?.provincia?.costo_envio || 0;

    const totalLineas = lineas.reduce((acc, l) => acc + l.sub_total, 0);
    const precio_total = totalLineas + precio_envio;

    const pedido = await prisma.pedido.update({
      where: { nro_pedido: parseInt(req.params.id) },
      data: {
        id_metodo,
        id_localidad,
        precio_total,
        linea_pedido: {
          deleteMany: {}, // borrar líneas anteriores
          create: lineas.map(lp => ({
            id_articulo: lp.id_articulo,
            cantidad: lp.cantidad,
            sub_total: lp.sub_total
          }))
        }
      },
      include: { linea_pedido: true }
    });

    res.json({ ...pedido, precio_envio });
  } catch (error) {
    console.error('ERROR AL ACTUALIZAR PEDIDO:', error);
    res.status(500).json({ error: error.message });
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

module.exports = router;
