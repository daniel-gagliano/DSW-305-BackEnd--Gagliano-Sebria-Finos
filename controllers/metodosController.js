const { PrismaClient } = require('@prisma/client');
const express = require('express')
const router = express.Router();
const prisma = new PrismaClient();

let metodos_pago = []; // array anterior para guardar en memoria
let contadorID = 1;
 

router.post('', (req, res) => {
  const { desc_metodo } = req.body;
  prisma.metodoPago.create({
    data: {
      desc_metodo
    }
  }) .then(()=>res.send("Metodo creado"))

});


// router.get('/metodos', (req, res) => res.json(metodos_pago));

router.get('', (req, res) => {
  prisma.metodoPago.findMany({
    where: {
      activo: true
    }
  }).then(metodos_pago => res.json(metodos_pago))
    .catch(error => res.status(500).json({ error: 'Error al obtener métodos de pago' }));
});

router.get('/:id', (req, res) => {
  const metodo = metodos_pago.find(m => m.id_metodo === parseInt(req.params.id));
  if (!metodo) return res.status(404).json({ error: 'Método no encontrado' });
  res.json(metodo);
});

router.delete('/:id', async (req, res) => {
  try {
    const metodoPago = await prisma.metodoPago.update({
      where: {
        id_metodo: parseInt(req.params.id)
      },
      data: {
        activo: false
      }
    });
    res.json({ mensaje: 'Método de pago desactivado correctamente' });
  } catch (error) {
    console.error('Error al desactivar método de pago:', error);
    res.status(500).json({ error: 'Error al desactivar el método de pago' });
  }
});


router.put('/:id', (req, res) => {
  const { descripcion } = req.body;
  const metodo = metodos_pago.find(m => m.id_metodo === parseInt(req.params.id));
  if (!metodo) return res.status(404).json({ error: 'Método no encontrado' });
  if (!descripcion) return res.status(400).json({ error: 'La descripción es obligatoria' });

  metodo.descripcion = descripcion;
  res.json(metodo);
});

/*
  router.delete('/metodos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = metodos_pago.findIndex(m => m.id_metodo === id);
  if (index === -1) return res.status(404).json({ error: 'Método no encontrado' });

  metodos_pago.splice(index, 1);
  res.json({ mensaje: 'Método eliminado correctamente' });
});
*/

module.exports = router;