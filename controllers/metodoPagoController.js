const metodoPagoRepository = require('../repository/metodoPago.repository');

class MetodoPagoController {
  async listarTodos(req, res) {
    try {
      const metodos = await metodoPagoRepository.findAll();
      res.json(metodos);
    } catch (error) {
      console.error('ERROR AL OBTENER MÉTODOS DE PAGO:', error);
      res.status(500).json({ error: 'Error al obtener métodos de pago' });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const id_metodo = parseInt(req.params.id);
      const metodo = await metodoPagoRepository.findById(id_metodo);

      if (!metodo) {
        return res.status(404).json({ error: 'Método de pago no encontrado' });
      }

      res.json(metodo);
    } catch (error) {
      console.error('ERROR AL OBTENER MÉTODO DE PAGO:', error);
      res.status(500).json({ error: 'Error al obtener método de pago' });
    }
  }

  async crear(req, res) {
    try {
      const { desc_metodo } = req.body;

      // Validaciones
      if (!desc_metodo) {
        return res.status(400).json({ 
          error: 'La descripción del método es obligatoria' 
        });
      }

      const data = {
        desc_metodo
      };

      const metodo = await metodoPagoRepository.create(data);
      res.status(201).json(metodo);
    } catch (error) {
      console.error('ERROR AL CREAR MÉTODO DE PAGO:', error);
      res.status(500).json({ 
        error: 'Error al crear método de pago',
        details: error.message 
      });
    }
  }

  async actualizar(req, res) {
    try {
      const id_metodo = parseInt(req.params.id);
      const { desc_metodo } = req.body;

      // Verificar que el método existe
      const metodoExistente = await metodoPagoRepository.findById(id_metodo);
      if (!metodoExistente) {
        return res.status(404).json({ error: 'Método de pago no encontrado' });
      }

      // Validaciones
      if (!desc_metodo) {
        return res.status(400).json({ 
          error: 'La descripción es obligatoria' 
        });
      }

      const data = {
        desc_metodo
      };

      const metodo = await metodoPagoRepository.update(id_metodo, data);
      res.json(metodo);
    } catch (error) {
      console.error('ERROR AL ACTUALIZAR MÉTODO DE PAGO:', error);
      res.status(500).json({ 
        error: 'Error al actualizar método de pago',
        details: error.message 
      });
    }
  }

  async eliminar(req, res) {
    try {
      const id_metodo = parseInt(req.params.id);

      // Verificar que el método existe
      const metodoExistente = await metodoPagoRepository.findById(id_metodo);
      if (!metodoExistente) {
        return res.status(404).json({ error: 'Método de pago no encontrado' });
      }

      await metodoPagoRepository.softDelete(id_metodo);
      res.json({ mensaje: 'Método de pago desactivado correctamente' });
    } catch (error) {
      console.error('ERROR AL DESACTIVAR MÉTODO DE PAGO:', error);
      res.status(500).json({ error: 'Error al desactivar el método de pago' });
    }
  }
}

module.exports = new MetodoPagoController();