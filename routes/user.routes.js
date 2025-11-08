const express = require('express');
const router = express.Router(); //mapea el string de la url con el archivo al que apunta, o sea, el controlador que se encarga de la peticion
const userController = require('../controllers/userController'); // los dos puntitos son para salir de la carpeta routes y entrar en controllers
                                                                //userController se define con require para poder usar los métodos que tiene el controlador

router.get('/', userController.listarTodos); //estos son los metodos que se definen en el controlador. Solo se usa la / porque ya se definió /usuarios en index.js
router.get('/:id', userController.obtenerPorId); 
router.post('/', userController.crear);
router.post('/login', userController.login);
router.put('/:id', userController.actualizar);
router.delete('/:id', userController.eliminar);

module.exports = router;