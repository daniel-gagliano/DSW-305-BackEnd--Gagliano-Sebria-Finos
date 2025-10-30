const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

router.get('', categoriaController.listarTodas);
router.get('/:id', categoriaController.obtenerPorId);
router.post('', categoriaController.crear);
router.put('/:id', categoriaController.actualizar);
router.delete('/:id', categoriaController.eliminar);

module.exports = router;