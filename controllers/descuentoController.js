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

//Listar todas los descuentos
router.get('', (req, res) => {
  prisma.Descuento.findMany()
    .then(Descuento => res.json(Descuento))
    .catch(error => res.status(500).json({ error: 'Error en get' }));
});

//filtrar por codigo
router.get(':id', (req, res) => {
  prisma.Descuento.findUnique({
    where: {
      cod_descuento: parseInt(req.params.id)
    }
  })
    .then(Descuento => res.json(Descuento))
    .catch(error => res.status(500).json({ error: 'Error en get id' }));
});


//Modificar algo por codigo
router.put(':id', (req, res) => {
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

router.delete(':id', async (req, res) => {
  await prisma.Descuento.delete({
    where: {
      cod_descuento: parseInt(req.params.id)
    }
  })
  await prisma.Descuento.findMany()
    .then(Descuento => res.json(todosLosDescuentos))
    .catch(error => res.status(500).json({ error: 'Error' }));
});

module.exports = router;