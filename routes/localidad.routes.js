const express = require('express');
const router = express.Router();
const localidadController = require('../controllers/localidadController');

router.get('', localidadController.listarTodas);
router.get('/provincia/:cod_provincia', localidadController.obtenerPorProvincia); // ← Importante: antes que /:id
router.get('/:id', localidadController.obtenerPorId);
router.post('/', localidadController.crear);
router.put('/:id', localidadController.actualizar);
router.delete('/:id', localidadController.eliminar);

module.exports = router;