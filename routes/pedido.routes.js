const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.get('/', pedidoController.listarTodos);
router.get('/:id', pedidoController.obtenerPorId);
router.get('/usuario/:nro_usuario', pedidoController.obtenerPorUsuario); 
router.post('/', pedidoController.crear);
router.put('/:id', pedidoController.actualizar);
router.post('/:id/estado', pedidoController.agregarEstado);
router.delete('/:id', pedidoController.eliminar);

module.exports = router;