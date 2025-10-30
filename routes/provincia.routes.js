const express = require('express');
const router = express.Router();
const provinciaController = require('../controllers/provinciaController');

router.get('', provinciaController.listarTodas);
router.get('/:id', provinciaController.obtenerPorId);
router.post('', provinciaController.crear);
router.put('/:id', provinciaController.actualizar);
router.delete('/:id', provinciaController.eliminar);

module.exports = router;