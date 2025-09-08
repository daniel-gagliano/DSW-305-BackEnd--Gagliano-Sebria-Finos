
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();

// Listar todos los usuarios
router.get('/', (req, res) => {
  prisma.user.findMany()
    .then(users => res.json(users))
    .catch(error => res.status(500).json({ error: error.message }));
});

// Obtener un usuario por ID
router.get('/:id', (req, res) => {
  prisma.user.findUnique({
    where: { id: parseInt(req.params.id) }
  })
    .then(user => res.json(user))
    .catch(error => res.status(500).json({ error: error.message }));
});

// Crear usuario
router.post('/', (req, res) => {
  const { name, email, password } = req.body;
  prisma.user.create({
    data: { name, email, password }
  })
    .then(user => res.status(201).json(user))
    .catch(error => res.status(500).json({ error: error.message }));
});

// Actualizar usuario
router.put('/:id', (req, res) => {
  const { name, email, password } = req.body;
  prisma.user.update({
    where: { id: parseInt(req.params.id) },
    data: { name, email, password }
  })
    .then(user => res.json(user))
    .catch(error => res.status(500).json({ error: error.message }));
});

// Borrar usuario
router.delete('/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: parseInt(req.params.id) }
    });
    const todosLosUsuarios = await prisma.user.findMany();
    res.json(todosLosUsuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
