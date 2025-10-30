const express = require('express');
const router = express.Router();
const articuloCategoriaController = require('../controllers/articuloCategoriaController');

router.get('', articuloCategoriaController.listarTodas);
router.get('/:id_categoria/:id_articulo', articuloCategoriaController.obtenerPorIds);
router.post('', articuloCategoriaController.crear);
router.delete('/:id_categoria/:id_articulo', articuloCategoriaController.eliminar);

module.exports = router;