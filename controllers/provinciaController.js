const provinciaRepository = require('../repository/provincia.repository');

class ProvinciaController {
  async listarTodas(req, res) {
    try {
      const provincias = await provinciaRepository.findAll();
      res.json(provincias);
    } catch (error) {
      console.error('ERROR AL OBTENER PROVINCIAS:', error);
      res.status(500).json({ error: 'Error al obtener provincias' });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const cod_provincia = parseInt(req.params.id);
      const provincia = await provinciaRepository.findById(cod_provincia);

      if (!provincia) {
        return res.status(404).json({ error: 'Provincia no encontrada' });
      }

      res.json(provincia);
    } catch (error) {
      console.error('ERROR AL OBTENER PROVINCIA:', error);
      res.status(500).json({ error: 'Error al obtener provincia' });
    }
  }

  async crear(req, res) {
    try {
      const { descripcion, costo_envio } = req.body;

      // Validaciones
      if (!descripcion || costo_envio === undefined) {
        return res.status(400).json({ 
          error: 'Descripción y costo de envío son obligatorios' 
        });
      }

      if (costo_envio < 0) {
        return res.status(400).json({ 
          error: 'El costo de envío no puede ser negativo' 
        });
      }

      const data = {
        descripcion,
        costo_envio: parseFloat(costo_envio)
      };

      const provincia = await provinciaRepository.create(data);
      res.status(201).json(provincia);
    } catch (error) {
      console.error('ERROR AL CREAR PROVINCIA:', error);
      res.status(500).json({ 
        error: 'Error al crear provincia',
        details: error.message 
      });
    }
  }

  async actualizar(req, res) {
    try {
      const cod_provincia = parseInt(req.params.id);
      const { descripcion, costo_envio } = req.body;

      // Verificar que la provincia existe
      const provinciaExistente = await provinciaRepository.findById(cod_provincia);
      if (!provinciaExistente) {
        return res.status(404).json({ error: 'Provincia no encontrada' });
      }

      // Validaciones
      if (!descripcion || costo_envio === undefined) {
        return res.status(400).json({ 
          error: 'Descripción y costo de envío son obligatorios' 
        });
      }

      if (costo_envio < 0) {
        return res.status(400).json({ 
          error: 'El costo de envío no puede ser negativo' 
        });
      }

      const data = {
        descripcion,
        costo_envio: parseFloat(costo_envio)
      };

      const provincia = await provinciaRepository.update(cod_provincia, data);
      res.json(provincia);
    } catch (error) {
      console.error('ERROR AL ACTUALIZAR PROVINCIA:', error);
      res.status(500).json({ 
        error: 'Error al actualizar provincia',
        details: error.message 
      });
    }
  }

  async eliminar(req, res) {
    try {
      const cod_provincia = parseInt(req.params.id);

      // Verificar que la provincia existe
      const provinciaExistente = await provinciaRepository.findById(cod_provincia);
      if (!provinciaExistente) {
        return res.status(404).json({ error: 'Provincia no encontrada' });
      }

      await provinciaRepository.softDelete(cod_provincia);
      res.json({ mensaje: 'Provincia desactivada correctamente' });
    } catch (error) {
      console.error('ERROR AL DESACTIVAR PROVINCIA:', error);
      res.status(500).json({ error: 'Error al desactivar provincia' });
    }
  }
}

module.exports = new ProvinciaController();