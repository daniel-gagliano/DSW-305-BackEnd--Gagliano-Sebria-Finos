const descuentoRepository = require('../repository/descuento.repository');

class DescuentoController {
  async listarTodos(req, res) {
    try {
      const descuentos = await descuentoRepository.findAll();
      res.json(descuentos);
    } catch (error) {
      console.error('ERROR AL OBTENER DESCUENTOS:', error);
      res.status(500).json({ error: 'Error al obtener descuentos' });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const cod_descuento = parseInt(req.params.id);
      const descuento = await descuentoRepository.findById(cod_descuento);

      if (!descuento) {
        return res.status(404).json({ error: 'Descuento no encontrado' });
      }

      res.json(descuento);
    } catch (error) {
      console.error('ERROR AL OBTENER DESCUENTO:', error);
      res.status(500).json({ error: 'Error al obtener descuento' });
    }
  }

  async crear(req, res) {
    try {
      const { desc_descuento } = req.body;

      // Validaciones
      if (!desc_descuento) {
        return res.status(400).json({ 
          error: 'La descripción del descuento es obligatoria' 
        });
      }

      const data = {
        desc_descuento
      };

      const descuento = await descuentoRepository.create(data);
      res.status(201).json(descuento);
    } catch (error) {
      console.error('ERROR AL CREAR DESCUENTO:', error);
      res.status(500).json({ 
        error: 'Error al crear descuento',
        details: error.message 
      });
    }
  }

  async actualizar(req, res) {
    try {
      const cod_descuento = parseInt(req.params.id);
      const { desc_descuento } = req.body;

      // Verificar que el descuento existe
      const descuentoExistente = await descuentoRepository.findById(cod_descuento);
      if (!descuentoExistente) {
        return res.status(404).json({ error: 'Descuento no encontrado' });
      }

      // Validaciones
      if (!desc_descuento) {
        return res.status(400).json({ 
          error: 'La descripción es obligatoria' 
        });
      }

      const data = {
        desc_descuento
      };

      const descuento = await descuentoRepository.update(cod_descuento, data);
      res.json(descuento);
    } catch (error) {
      console.error('ERROR AL ACTUALIZAR DESCUENTO:', error);
      res.status(500).json({ 
        error: 'Error al actualizar descuento',
        details: error.message 
      });
    }
  }

  async eliminar(req, res) {
    try {
      const cod_descuento = parseInt(req.params.id);

      // Verificar que el descuento existe
      const descuentoExistente = await descuentoRepository.findById(cod_descuento);
      if (!descuentoExistente) {
        return res.status(404).json({ error: 'Descuento no encontrado' });
      }

      await descuentoRepository.softDelete(cod_descuento);
      res.json({ mensaje: 'Descuento desactivado correctamente' });
    } catch (error) {
      console.error('ERROR AL DESACTIVAR DESCUENTO:', error);
      res.status(500).json({ error: 'Error al desactivar el descuento' });
    }
  }
}

module.exports = new DescuentoController();