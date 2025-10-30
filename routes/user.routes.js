const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.listarTodos);
router.get('/:id', userController.obtenerPorId);
router.post('/', userController.crear);
router.post('/login', userController.login);
router.put('/:id', userController.actualizar);
router.delete('/:id', userController.eliminar);

module.exports = router;