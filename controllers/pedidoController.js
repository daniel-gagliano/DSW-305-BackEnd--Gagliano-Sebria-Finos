const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Crear un pedido con líneas
router.post('/', async (req, res) => {
  const { id_metodo, nro_usuario, id_localidad, precio_total, lineas_pedido } = req.body;

  const lineas = lineas_pedido || []; //asi no se rompe el .map si no mandan lineas_pedido

  try {
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
      include: {
        lineas_pedido: true
      }
    });
    res.status(201).json(pedido);
  } catch (error) {
    console.error('ERROR AL CREAR PEDIDO:', error);
    res.status(500).json({
      error: error.message,
      code: error.code,
      meta: error.meta
    });
  }
});


// Listar todos los pedidos
router.get('/', async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: { lineas_pedido: true }
    });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// Obtener pedido por ID
router.get('/:id', async (req, res) => {
  try {
    const pedido = await prisma.pedido.findUnique({
      where: { nro_pedido: parseInt(req.params.id) },
      include: { lineas_pedido: true }
    });
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pedido' });
  }
});

// Actualizar pedido (solo precio_total y localidad/metodo)
router.put('/:id', async (req, res) => {
  const { precio_total, id_localidad, id_metodo } = req.body;
  try {
    const pedido = await prisma.pedido.update({
      where: { nro_pedido: parseInt(req.params.id) },
      data: { precio_total, id_localidad, id_metodo }
    });
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar pedido' });
  }
});

// Agregar estado a un pedido
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
    res.status(500).json({ error: 'Error al agregar estado' });
  }
});

// Eliminar un pedido
router.delete('/:id', async (req, res) => {
  try {
    await prisma.pedido.delete({
      where: { nro_pedido: parseInt(req.params.id) }
    });
    res.json({ mensaje: 'Pedido eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar pedido' });
  }
});

module.exports = router;
