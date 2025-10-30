const express = require('express');
const router = express.Router();
const lineaPedidoController = require('../controllers/lineaPedidoController');

router.get('', lineaPedidoController.listarTodas);
router.get('/:nro_pedido/:id_articulo', lineaPedidoController.obtenerPorIds);
router.post('', lineaPedidoController.crear);
router.put('/:nro_pedido/:id_articulo', lineaPedidoController.actualizar);
router.delete('/:nro_pedido/:id_articulo', lineaPedidoController.eliminar);

module.exports = router;