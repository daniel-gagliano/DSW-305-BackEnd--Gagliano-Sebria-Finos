// routes/pedidoRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const pedidoController = require('../controllers/pedidoController');

const router = express.Router();

router.post(
  '/',
  [
    body('id_metodo').isInt().withMessage('Método de pago inválido'),
    body('nro_usuario').isInt().withMessage('Usuario inválido'),
    body('id_localidad').isInt().withMessage('Localidad inválida'),
    body('linea_pedido')
      .isArray({ min: 1 })
      .withMessage('Debe contener al menos una línea de pedido'),
    body('linea_pedido.*.id_articulo')
      .isInt()
      .withMessage('Cada línea debe tener un artículo válido'),
    body('linea_pedido.*.cantidad')
      .isInt({ min: 1 })
      .withMessage('La cantidad debe ser al menos 1'),
    body('linea_pedido.*.sub_total')
      .isFloat({ min: 0 })
      .withMessage('El subtotal debe ser mayor o igual a 0'),
  ], //cuando se activa la función, lo que pasa despues es el "callback" (funcion adentro de otra funcion), esto de aca abajo:
  (req, res, next) => { // req = request (lo que viene del cliente), res = response (lo que le voy a devolver al cliente)
    // y next = si todo sale bien, sigue con la siguiente función (que en este caso es createPedido)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  pedidoController.createPedido
);

module.exports = router;