const userRepository = require('../repository/user.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserController {
  async listarTodos(req, res) {
    try {
      const users = await userRepository.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const user = await userRepository.findById(id);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async crear(req, res) {
    try {
      const { name, email, password, rol } = req.body;
      
      // Validaciones
      if (!name || !email || !password) {
        return res.status(400).json({ 
          error: 'Nombre, email y contraseña son obligatorios' 
        });
      }
      
      // Verificar si el email ya existe
      const existing = await userRepository.findByEmail(email);
      if (existing) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
      
      // Hashear la contraseña
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Crear usuario
      const user = await userRepository.create({
        name,
        email,
        password: hashedPassword,
        rol: rol || 'CLIENTE'
      });
      
      // No devolver la contraseña
      const { password: _p, ...userNoPass } = user;
      res.status(201).json(userNoPass);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validaciones
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email y contraseña son obligatorios' 
        });
      }
      
      // Buscar usuario por email
      const user = await userRepository.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      
      // Comparar contraseñas
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
      
      // Remover contraseña del objeto
      const { password: _p, ...userNoPass } = user;
      
      console.log('Usuario logueado:', userNoPass);
      
      // Crear token JWT
      const token = jwt.sign(
        { id: userNoPass.id, email: userNoPass.email, rol: userNoPass.rol },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '7d' }
      );
      
      return res.status(200).json({
        user: userNoPass,
        token,
        message: 'Inicio de sesión exitoso'
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async actualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { name, email, password, rol } = req.body;
      
      // Verificar que el usuario existe
      const userExistente = await userRepository.findById(id);
      if (!userExistente) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      const data = {};
      
      if (name) data.name = name;
      if (email) data.email = email;
      if (rol) data.rol = rol;
      
      // Si viene password, hashearlo
      if (password) {
        const saltRounds = 10;
        data.password = await bcrypt.hash(password, saltRounds);
      }
      
      const user = await userRepository.update(id, data);
      
      // No devolver la contraseña
      const { password: _p, ...userNoPass } = user;
      res.json(userNoPass);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async eliminar(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      // Verificar que el usuario existe
      const userExistente = await userRepository.findById(id);
      if (!userExistente) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      await userRepository.delete(id);
      
      const todosLosUsuarios = await userRepository.findAll();
      res.json(todosLosUsuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();