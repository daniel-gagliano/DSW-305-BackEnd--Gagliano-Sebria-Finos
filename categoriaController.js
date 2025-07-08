const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const express = require('express')
const router = express.Router();


/*cod_categoria
nom_cat
desc_cat*/

//Metodo post para cargar una nueva categoria
router.post('', (req, res) => {
  const { cod_categoria, nom_cat, desc_cat } = req.body;
  prisma.Categoria.create({
    data: {
      cod_categoria, 
      nom_cat, 
      desc_cat
    }
  })
    .then(Categoria => res.status(201).json(Categoria))
    .catch(error => res.status(500).json({ error: 'Error'}));
});

//Listar todas las categorias
router.get('', (req, res) => {
  prisma.Categoria.findMany()
    .then(Categoria => res.json(Categoria))
    .catch(error => res.status(500).json({ error: 'Error' }));
});

//filtrar por id
router.get(':id', (req, res) => {
  prisma.Categoria.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  })
    .then(Categoria => res.json(Categoria))
    .catch(error => res.status(500).json({ error: 'Error' }));
});


//Modificar algo por id
router.put(':id', (req, res) => {
  const { cod_categoria, nom_cat, desc_cat } = req.body;
  prisma.Categoria.update({
    where: {
      id: parseInt(req.params.id)
    },
    data: {
      cod_categoria, 
      nom_cat, 
      desc_cat
    }
  })
    .then(Categoria => res.json(Categoria))
    .catch(error => res.status(500).json({ error: 'Error' }));
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