const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();


//Metodo post para cargar un nuevo descuento
router.post('', (req, res) => {
  const { cod_descuento, desc_descuento} = req.body;
  prisma.Descuento.create({
    data: {
      cod_descuento, 
      desc_descuento
    }
  })
    .then((Descuento)=>res.send("Descuento Creado"))
    .catch(error => res.status(500).json({ error: 'Error en post'}));
});

//Listar todos los descuentos activos
router.get('', (req, res) => {
  prisma.Descuento.findMany({
    where: {
      activo: true
    }
  })
    .then(Descuento => res.json(Descuento))
    .catch(error => res.status(500).json({ error: 'Error en get' }));
});

//filtrar por codigo
router.get('/:id', (req, res) => {
  prisma.Descuento.findUnique({
    where: {
      cod_descuento: parseInt(req.params.id)
    }
  })
    .then(Descuento => res.json(Descuento))
    .catch(error => res.status(500).json({ error: 'Error en get id' }));
});


//Modificar algo por codigo
router.put('/:id', (req, res) => {
  const { cod_descuento, desc_descuento } = req.body;
  prisma.Descuento.update({
    where: {
      cod_descuento: parseInt(req.params.id)
    },
    data: {
        cod_descuento, 
        desc_descuento
    }
  })
    .then(Descuento => res.json(Descuento))
    .catch(error => res.status(500).json({ error: 'Error en put id' }));
});

router.delete('/:id', async (req, res) => {
  try {
    const descuento = await prisma.Descuento.update({
      where: {
        cod_descuento: parseInt(req.params.id)
      },
      data: {
        activo: false
      }
    });
    res.json({ mensaje: 'Descuento desactivado correctamente' });
  } catch (error) {
    console.error('Error al desactivar descuento:', error);
    res.status(500).json({ error: 'Error al desactivar el descuento' });
  }
});

module.exports = router;