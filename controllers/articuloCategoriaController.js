// traigo prisma pa' hablar con la DB
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// express pa' definir rutas REST
const express = require('express');
const router = express.Router();

// Crear relación artículo-categoría
// POST /articulo_categoria
// Espera un body con id_categoria e id_articulo (pueden venir como strings)
// y los transforma a enteros antes de guardar.
router.post('', async (req, res) => {
  const { id_categoria, id_articulo } = req.body;
  try {
    // uso prisma para crear la fila en la tabla puente
    const created = await prisma.Categoria_Articulo.create({
      data: {
        id_categoria: parseInt(id_categoria),
        id_articulo: parseInt(id_articulo)
      }
    });
    // devuelvo 201 con lo que se creó
    res.status(201).json(created);
  } catch (error) {
    // si falla, mandamos 500 y un mensaje
    res.status(500).json({ error: error.message || 'Error creando relacion' });
  }
});

// Obtener todas las relaciones
// GET /articulo_categoria
// Devuelve todas las filas de la tabla puente
router.get('', async (req, res) => {
  try {
    const relaciones = await prisma.Categoria_Articulo.findMany();
    res.json(relaciones);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error en get' });
  }
});

// Obtener relación por ids (ruta acepta /:id_categoria/:id_articulo)
// GET /articulo_categoria/:id_categoria/:id_articulo
// Usa la PK compuesta para buscar la fila exacta
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
// DELETE /articulo_categoria/:id_categoria/:id_articulo
// Borra la fila y devuelve lo que queda
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
