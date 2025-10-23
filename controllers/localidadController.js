const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();

// Crear una nueva localidad
router.post('/', async (req, res) => {
  const { nombre, codigo_postal, cod_provincia } = req.body;

  try {
    // El método create crea una nueva localidad en la base de datos
    const localidad = await prisma.localidad.create({
      data: {
        nombre,
        codigo_postal,
        // El connect establece la relación con la provincia usando su código
        provincia: { connect: { cod_provincia } }
      }
    });
    // Devuelve la localidad creada con status 201 (Created)
    res.status(201).json(localidad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear localidad' });
  }
});

// Listar todas las localidades activas
router.get('', (req, res) => {
  // El método findMany busca todas las localidades activas
  prisma.Localidad.findMany({
    where: {
      activo: true
    }
  })
    .then(localidades => res.json(localidades))
    .catch(error => res.status(500).json({ error: 'Error al obtener localidades' }));
});

// **NUEVO ENDPOINT**: Obtener localidades filtradas por provincia
// Este endpoint se ejecuta cuando la URL es /localidades/provincia/:cod_provincia
router.get('/provincia/:cod_provincia', async (req, res) => {
  try {
    // El parseInt convierte el parámetro de la URL (string) a número entero
    const cod_provincia = parseInt(req.params.cod_provincia);
    
    // El findMany con where filtra las localidades que pertenecen a la provincia especificada
    const localidades = await prisma.localidad.findMany({
      where: {
        cod_provincia: cod_provincia
      },
      // El include trae también los datos de la provincia relacionada
      include: {
        provincia: true
      }
    });
    
    // Devuelve el array de localidades que coinciden con la provincia
    res.json(localidades);
  } catch (error) {
    console.error('Error al obtener localidades por provincia:', error);
    res.status(500).json({ error: 'Error al obtener localidades' });
  }
});

// Obtener una localidad por ID
router.get('/:id', (req, res) => {
  // El findUnique busca una sola localidad usando su ID como criterio
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
  // El update modifica una localidad existente identificada por su ID
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

// Desactivar una localidad (soft delete)
router.delete('/:id', (req, res) => {
  // El update cambia el estado activo a false
  prisma.Localidad.update({
    where: {
      id_localidad: parseInt(req.params.id)
    },
    data: {
      activo: false
    }
  })
    .then(() => res.json({ mensaje: 'Localidad desactivada correctamente' }))
    .catch(error => res.status(500).json({ error: 'Error al desactivar localidad' }));
});

module.exports = router;