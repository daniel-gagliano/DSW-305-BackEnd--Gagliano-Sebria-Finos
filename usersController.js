const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express')
const router = express.Router();

router.get('', (req, res) => {
  prisma.User.findMany()
    .then(users => res.json(users))
    .catch(error => res.status(500).json({ error: 'Error' }));
});

router.get(':id', (req, res) => {
  prisma.User.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  })
    .then(users => res.json(users))
    .catch(error => res.status(500).json({ error: 'Error' }));
});

router.post('', (req, res) => {
  const { name, email, password } = req.body;
  prisma.User.create({
    data: {
      name,
      email,
      password
    }
  })
    .then(user => res.status(201).json(user))
    .catch(error => res.status(500).json({ error: 'Error'}));
});

router.put(':id', (req, res) => {
  const { name, email, password } = req.body;
  prisma.User.update({
    where: {
      id: parseInt(req.params.id)
    },
    data: {
      name,
      email,
      password
    }
  })
    .then(user => res.json(user))
    .catch(error => res.status(500).json({ error: 'Error' }));
});

router.delete(':id', async (req, res) => {
  await prisma.User.delete({
    where: {
      id: parseInt(req.params.id)
    }
  })
  await prisma.User.findMany()
    .then(user => res.json(todosLosUsuarios))
    .catch(error => res.status(500).json({ error: 'Error' }));
});

module.exports = router;