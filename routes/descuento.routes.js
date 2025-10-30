const express = require('express');
const router = express.Router();
const descuentoController = require('../controllers/descuentoController');

router.get('', descuentoController.listarTodos);
router.get('/:id', descuentoController.obtenerPorId);
router.post('', descuentoController.crear);
router.put('/:id', descuentoController.actualizar);
router.delete('/:id', descuentoController.eliminar);

module.exports = router;