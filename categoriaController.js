const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express')
const router = express.Router();


//Metodo post para cargar una nueva categoria
router.post('', (req, res) => {
  const { id_categoria, nom_categoria, desc_categoria } = req.body;
  prisma.Categoria.create({
    data: {
      id_categoria, 
      nom_categoria, 
      desc_categoria
    }
  })
    .then(()=>res.send("Categoria Creada"))
    .catch(error => res.status(500).json({ error: 'Error en post'}));
});

//Listar todas las categorias
router.get('', (req, res) => {
  prisma.Categoria.findMany()
    .then(Categoria => res.json(Categoria))
    .catch(error => res.status(500).json({ error: 'Error en get' }));
});

//filtrar por id
router.get(':id', (req, res) => {
  prisma.Categoria.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  })
    .then(Categoria => res.json(Categoria))
    .catch(error => res.status(500).json({ error: 'Error en get id' }));
});


//Modificar algo por id
router.put(':id', (req, res) => {
  const { id_categoria, nom_categoria, desc_categoria } = req.body;
  prisma.Categoria.update({
    where: {
      id: parseInt(req.params.id)
    },
    data: {
      id_categoria, 
      nom_categoria, 
      desc_categoria
    }
  })
    .then(Categoria => res.json(Categoria))
    .catch(error => res.status(500).json({ error: 'Error en put id' }));
});

router.delete(':id', async (req, res) => {
  await prisma.Categoria.delete({
    where: {
      id: parseInt(req.params.id)
    }
  })
  await prisma.Categoria.findMany()
    .then(Categoria => res.json(todaslasCategorias))
    .catch(error => res.status(500).json({ error: 'Error' }));
});

module.exports = router;