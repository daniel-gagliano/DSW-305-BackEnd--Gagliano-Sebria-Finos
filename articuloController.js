const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();

// Obtener todos los artículos
router.get('', (req, res) => {
  prisma.Articulo.findMany()
    .then(articulos => res.json(articulos))
    .catch(error => res.status(500).json({ error: 'Error al obtener los artículos' }));
});

// Obtener un artículo por ID
router.get('/:id', (req, res) => {
  prisma.Articulo.findUnique({
    where: {
      id_articulo: parseInt(req.params.id)
    }
  })
    .then(articulo => res.json(articulo))
    .catch(error => res.status(500).json({ error: 'Error al obtener el artículo' }));
});

// Crear un nuevo artículo
router.post('', (req, res) => {
  const { nombre, descripcion, stock, precio } = req.body;
  prisma.Articulo.create({
    data: {
      nombre,
      descripcion,
      stock,
      precio
    }
  })
    .then(articulo => res.status(201).json(articulo))
    .catch(error => res.status(500).json({ error: 'Error al crear el artículo' }));
});

// Actualizar un artículo existente
router.put('/:id', (req, res) => {
  const { nombre, descripcion, stock, precio } = req.body;
  prisma.Articulo.update({
    where: {
      id_articulo: parseInt(req.params.id)
    },
    data: {
      nombre,
      descripcion,
      stock,
      precio
    }
  })
    .then(articulo => res.json(articulo))
    .catch(error => res.status(500).json({ error: 'Error al actualizar el artículo' }));
});

// Eliminar un artículo
router.delete('/:id', (req, res) => {
  prisma.Articulo.delete({
    where: {
      id_articulo: parseInt(req.params.id)
    }
  })
    .then(() => res.json({ mensaje: 'Artículo eliminado correctamente' }))
    .catch(error => res.status(500).json({ error: 'Error al eliminar el artículo' }));
});

module.exports = router;
