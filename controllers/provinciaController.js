const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();

// Crear provincia
router.post('', (req, res) => {
  const { descripcion, costo_envio } = req.body;
  prisma.Provincia.create({
    data: {
      descripcion,
      costo_envio
    }
  })
    .then(provincia => res.status(201).json(provincia))
    .catch(error => res.status(500).json({ error: 'Error al crear provincia' }));
});

// Obtener todas las provincias activas
router.get('', (req, res) => {
  prisma.Provincia.findMany({
    where: {
      activo: true
    }
  })
    .then(provincias => res.json(provincias))
    .catch(error => res.status(500).json({ error: 'Error al obtener provincias' }));
});

// Obtener por ID
router.get('/:id', (req, res) => {
  prisma.Provincia.findUnique({
    where: {
      cod_provincia: parseInt(req.params.id)
    }
  })
    .then(provincia => res.json(provincia))
    .catch(error => res.status(500).json({ error: 'Error al obtener provincia' }));
});

// Actualizar provincia
router.put('/:id', (req, res) => {
  const { descripcion, costo_envio } = req.body;
  prisma.Provincia.update({
    where: {
      cod_provincia: parseInt(req.params.id)
    },
    data: {
      descripcion,
      costo_envio
    }
  })
    .then(provincia => res.json(provincia))
    .catch(error => res.status(500).json({ error: 'Error al actualizar provincia' }));
});

// Desactivar provincia (soft delete)
router.delete('/:id', (req, res) => {
  prisma.Provincia.update({
    where: {
      cod_provincia: parseInt(req.params.id)
    },
    data: {
      activo: false
    }
  })
    .then(() => res.json({ mensaje: 'Provincia desactivada correctamente' }))
    .catch(error => res.status(500).json({ error: 'Error al desactivar provincia' }));
});

module.exports = router;
