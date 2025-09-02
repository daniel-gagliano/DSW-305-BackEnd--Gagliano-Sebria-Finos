const { PrismaClient } = require('@prisma/client');
const express = require('express');
const router = express.Router();
const prisma = new PrismaClient();

// Crear línea de pedido
router.post('', async (req, res) => {
  try {
    const { nro_pedido, id_articulo, cantidad } = req.body;

    // opcional: buscar el artículo para calcular subtotal
    const articulo = await prisma.articulo.findUnique({
      where: { id_articulo },
    });
    if (!articulo) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }

    const sub_total = articulo.precio * cantidad;

    const linea = await prisma.linea_Pedido.create({
      data: {
        nro_pedido,
        id_articulo,
        cantidad,
        sub_total,
      },
    });

    res.json(linea);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear línea de pedido' });
  }
});

// Listar líneas (opcional: filtrar por nro_pedido)
router.get('', async (req, res) => {
  const { nro_pedido } = req.query;
  const where = nro_pedido ? { nro_pedido: Number(nro_pedido) } : {};
  const lineas = await prisma.linea_Pedido.findMany({ where });
  res.json(lineas);
});

// Obtener línea por PK compuesta
router.get('/:nro_pedido/:id_articulo', async (req, res) => {
  const { nro_pedido, id_articulo } = req.params;
  const linea = await prisma.linea_Pedido.findUnique({
    where: {
      nro_pedido_id_articulo: {
        nro_pedido: Number(nro_pedido),
        id_articulo: Number(id_articulo),
      },
    },
  });
  if (!linea) return res.status(404).json({ error: 'Línea no encontrada' });
  res.json(linea);
});

// Actualizar
router.put('/:nro_pedido/:id_articulo', async (req, res) => {
  const { nro_pedido, id_articulo } = req.params;
  const { cantidad } = req.body;

  try {
    const articulo = await prisma.articulo.findUnique({
      where: { id_articulo: Number(id_articulo) },
    });
    if (!articulo) return res.status(404).json({ error: 'Artículo no encontrado' });

    const sub_total = articulo.precio * cantidad;

    const linea = await prisma.linea_Pedido.update({
      where: {
        nro_pedido_id_articulo: {
          nro_pedido: Number(nro_pedido),
          id_articulo: Number(id_articulo),
        },
      },
      data: { cantidad, sub_total },
    });

    res.json(linea);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar línea' });
  }
});

// Eliminar
router.delete('/:nro_pedido/:id_articulo', async (req, res) => {
  const { nro_pedido, id_articulo } = req.params;
  try {
    await prisma.linea_Pedido.delete({
      where: {
        nro_pedido_id_articulo: {
          nro_pedido: Number(nro_pedido),
          id_articulo: Number(id_articulo),
        },
      },
    });
    res.json({ mensaje: 'Línea eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar línea' });
  }
});

module.exports = router;
