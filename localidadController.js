const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();

// Crear una nueva localidad
router.post('', (req, res) => {
  const { nombre, codigo_postal } = req.body;
  prisma.Localidad.create({
    data: {
      nombre,
      codigo_postal
    }
  })
    .then(localidad => res.status(201).json(localidad))
    .catch(error => res.status(500).json({ error: 'Error al crear localidad' }));
});

// Listar todas las localidades
router.get('', (req, res) => {
  prisma.Localidad.findMany()
    .then(localidades => res.json(localidades))
    .catch(error => res.status(500).json({ error: 'Error al obtener localidades' }));
});

// Obtener una localidad por ID
router.get('/:id', (req, res) => {
  prisma.Localidad.findUnique({
    where: {
      id_localidad: parseInt(req.params.id)
    }
  })
    .then(localidad => res.json(localidad))
    .catch(error => res.status(500).json({ error: 'Error al obtener la localidad' }));
});

// Actualizar una localidad
router.put('/:id', (req, res) => {
  const { nombre, codigo_postal } = req.body;
  prisma.Localidad.update({
    where: {
      id_localidad: parseInt(req.params.id)
    },
    data: {
      nombre,
      codigo_postal
    }
  })
    .then(localidad => res.json(localidad))
    .catch(error => res.status(500).json({ error: 'Error al actualizar localidad' }));
});

// Eliminar una localidad
router.delete('/:id', (req, res) => {
  prisma.Localidad.delete({
    where: {
      id_localidad: parseInt(req.params.id)
    }
  })
    .then(() => res.json({ mensaje: 'Localidad eliminada' }))
    .catch(error => res.status(500).json({ error: 'Error al eliminar localidad' }));
});

module.exports = router;
