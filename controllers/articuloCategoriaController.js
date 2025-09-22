const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();

// Crear relación artículo-categoría
router.post('', async (req, res) => {
  const { id_categoria, id_articulo } = req.body;
  try {
    const created = await prisma.Categoria_Articulo.create({
      data: {
        id_categoria: parseInt(id_categoria),
        id_articulo: parseInt(id_articulo)
      }
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error creando relacion' });
  }
});

// Obtener todas las relaciones
router.get('', async (req, res) => {
  try {
    const relaciones = await prisma.Categoria_Articulo.findMany();
    res.json(relaciones);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error en get' });
  }
});

// Obtener relación por ids (ruta acepta /:id_categoria/:id_articulo)
router.get('/:id_categoria/:id_articulo', async (req, res) => {
  const { id_categoria, id_articulo } = req.params;
  try {
    const rel = await prisma.Categoria_Articulo.findUnique({
      where: {
        // Prisma composite primary key
        id_categoria_id_articulo: {
          id_categoria: parseInt(id_categoria),
          id_articulo: parseInt(id_articulo)
        }
      }
    });
    res.json(rel);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error en get by ids' });
  }
});

// Eliminar relación por ids
router.delete('/:id_categoria/:id_articulo', async (req, res) => {
  const { id_categoria, id_articulo } = req.params;
  try {
    await prisma.Categoria_Articulo.delete({
      where: {
        id_categoria_id_articulo: {
          id_categoria: parseInt(id_categoria),
          id_articulo: parseInt(id_articulo)
        }
      }
    });
    const restantes = await prisma.Categoria_Articulo.findMany();
    res.json(restantes);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error al eliminar relacion' });
  }
});

module.exports = router;
