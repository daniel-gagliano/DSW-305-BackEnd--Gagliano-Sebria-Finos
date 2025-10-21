// traigo el cliente de prisma para hablar con la DB (MySQL)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// express para definir rutas tipo REST
const express = require('express');
const router = express.Router();

// bcrypt para hashear contraseñas antes de guardarlas en la DB
const bcrypt = require('bcrypt');

// Listar todos los usuarios
// GET /usuarios
// Nota: devuelve todos los usuarios tal cual están en la DB (sin filtros).
router.get('/', (req, res) => {
  prisma.user.findMany()
    // si anda, devuelvo la lista en JSON
    .then(users => res.json(users))
    // si hay un error lo mando como 500 con mensaje
    .catch(error => res.status(500).json({ error: error.message }));
});

// Obtener un usuario por ID
// GET /usuarios/:id
// Busca por la PK id (se parsea a entero porque viene en params como string)
router.get('/:id', (req, res) => {
  prisma.user.findUnique({
    where: { id: parseInt(req.params.id) }
  })
    .then(user => res.json(user))
    .catch(error => res.status(500).json({ error: error.message }));
});

// Crear usuario
// POST /usuarios
// Validación mínima y hash de password antes de guardar
router.post('/', async (req, res) => {
  try {
    const { name, email, password, rol } = req.body; // ← Agregar rol
    // chequeo si ya existe un usuario con ese email para evitar unique constraint error
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    // saltRounds: cuantas vueltas de hashing (10 para buena performance)
    const saltRounds = 10;
    // hasheo la contraseña para no guardarla en texto plano
    const hashed = await bcrypt.hash(password, saltRounds);
    // creo el usuario en la DB con la pass hasheada
    const user = await prisma.user.create({
      data: { 
        name, 
        email, 
        password: hashed,
        rol: rol || 'CLIENTE' // ← Por defecto CLIENTE si no viene rol
      }
    });
    // No devuelvo la contraseña en la respuesta por seguridad
    const { password: _p, ...userNoPass } = user;
    // devuelvo 201 con el usuario (sin pass)
    res.status(201).json(userNoPass);
  } catch (error) {
    // si algo falla lo mando 500 y el mensaje de error
    res.status(500).json({ error: error.message });
  }
});

// Login: validar email + password
// POST /usuarios/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // busco el usuario por email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    // comparo password con el hash guardado
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    // devuelvo el usuario sin la contraseña y un token simple
    const { password: _p, ...userNoPass } = user;
    
    // Log para debug (puedes quitarlo después)
    console.log('Usuario logueado:', userNoPass); // ← Ver qué devuelve
    
    // crear token sencillo (en un secreto real usar variable de entorno)
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: userNoPass.id, email: userNoPass.email, rol: userNoPass.rol }, // ← Incluir rol en token
      process.env.JWT_SECRET || 'dev-secret', 
      { expiresIn: '7d' }
    );
    
    return res.status(200).json({ 
      user: userNoPass, // Ya incluye el campo 'rol'
      token, 
      message: 'Inicio de sesión exitoso' 
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Actualizar usuario
// PUT /usuarios/:id
// Ahora también hashea la contraseña si viene
router.put('/:id', async (req, res) => {
  try {
    const { name, email, password, rol } = req.body;
    const data = { name, email };
    
    // Si viene rol, lo agrego
    if (rol) {
      data.rol = rol;
    }
    
    // Si viene password, lo hasheo
    if (password) {
      const saltRounds = 10;
      data.password = await bcrypt.hash(password, saltRounds);
    }
    
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data
    });
    
    const { password: _p, ...userNoPass } = user;
    res.json(userNoPass);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Borrar usuario
// DELETE /usuarios/:id
// Borra por id y devuelve la lista actualizada
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
