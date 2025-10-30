const express = require('express');
const router = express.Router();
const articuloController = require('../controllers/articuloController');

router.get('', articuloController.obtenerTodos);
router.get('/:id', articuloController.obtenerPorId);
router.post('', articuloController.crear);
router.put('/:id', articuloController.actualizar);
router.delete('/:id', articuloController.eliminar);

module.exports = router;