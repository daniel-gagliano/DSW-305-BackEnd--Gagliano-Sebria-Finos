const express = require('express');
const router = express.Router();
const metodoPagoController = require('../controllers/metodoPagoController');

router.get('', metodoPagoController.listarTodos);
router.get('/:id', metodoPagoController.obtenerPorId);
router.post('', metodoPagoController.crear);
router.put('/:id', metodoPagoController.actualizar);
router.delete('/:id', metodoPagoController.eliminar);

module.exports = router;