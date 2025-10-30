const localidadRepository = require('../repository/localidad.repository');

class LocalidadController {
  async listarTodas(req, res) {
    try {
      const localidades = await localidadRepository.findAll();
      res.json(localidades);
    } catch (error) {
      console.error('ERROR AL OBTENER LOCALIDADES:', error);
      res.status(500).json({ error: 'Error al obtener localidades' });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const id_localidad = parseInt(req.params.id);
      const localidad = await localidadRepository.findById(id_localidad);

      if (!localidad) {
        return res.status(404).json({ error: 'Localidad no encontrada' });
      }

      res.json(localidad);
    } catch (error) {
      console.error('ERROR AL OBTENER LOCALIDAD:', error);
      res.status(500).json({ error: 'Error al obtener la localidad' });
    }
  }

  async obtenerPorProvincia(req, res) {
    try {
      const cod_provincia = parseInt(req.params.cod_provincia);
      
      // Verificar que la provincia existe
      const provincia = await localidadRepository.findProvinciaById(cod_provincia);
      if (!provincia) {
        return res.status(404).json({ error: 'Provincia no encontrada' });
      }

      const localidades = await localidadRepository.findByProvincia(cod_provincia);
      res.json(localidades);
    } catch (error) {
      console.error('ERROR AL OBTENER LOCALIDADES POR PROVINCIA:', error);
      res.status(500).json({ error: 'Error al obtener localidades' });
    }
  }

  async crear(req, res) {
    try {
      const { nombre, codigo_postal, cod_provincia } = req.body;

      // Validaciones
      if (!nombre || !codigo_postal || !cod_provincia) {
        return res.status(400).json({ 
          error: 'Nombre, código postal y código de provincia son obligatorios' 
        });
      }

      // Verificar que la provincia existe
      const provincia = await localidadRepository.findProvinciaById(Number(cod_provincia));
      if (!provincia) {
        return res.status(404).json({ error: 'Provincia no encontrada' });
      }

      const data = {
        nombre,
        codigo_postal,
        provincia: { connect: { cod_provincia: Number(cod_provincia) } }
      };

      const localidad = await localidadRepository.create(data);
      res.status(201).json(localidad);
    } catch (error) {
      console.error('ERROR AL CREAR LOCALIDAD:', error);
      res.status(500).json({ 
        error: 'Error al crear localidad',
        details: error.message 
      });
    }
  }

  async actualizar(req, res) {
    try {
      const id_localidad = parseInt(req.params.id);
      const { nombre, codigo_postal, cod_provincia } = req.body;

      // Verificar que la localidad existe
      const localidadExistente = await localidadRepository.findById(id_localidad);
      if (!localidadExistente) {
        return res.status(404).json({ error: 'Localidad no encontrada' });
      }

      // Validaciones
      if (!nombre || !codigo_postal) {
        return res.status(400).json({ 
          error: 'Nombre y código postal son obligatorios' 
        });
      }

      const data = {
        nombre,
        codigo_postal
      };

      // Si se quiere cambiar la provincia
      if (cod_provincia) {
        const provincia = await localidadRepository.findProvinciaById(Number(cod_provincia));
        if (!provincia) {
          return res.status(404).json({ error: 'Provincia no encontrada' });
        }
        data.provincia = { connect: { cod_provincia: Number(cod_provincia) } };
      }

      const localidad = await localidadRepository.update(id_localidad, data);
      res.json(localidad);
    } catch (error) {
      console.error('ERROR AL ACTUALIZAR LOCALIDAD:', error);
      res.status(500).json({ 
        error: 'Error al actualizar localidad',
        details: error.message 
      });
    }
  }

  async eliminar(req, res) {
    try {
      const id_localidad = parseInt(req.params.id);

      // Verificar que la localidad existe
      const localidadExistente = await localidadRepository.findById(id_localidad);
      if (!localidadExistente) {
        return res.status(404).json({ error: 'Localidad no encontrada' });
      }

      await localidadRepository.softDelete(id_localidad);
      res.json({ mensaje: 'Localidad desactivada correctamente' });
    } catch (error) {
      console.error('ERROR AL DESACTIVAR LOCALIDAD:', error);
      res.status(500).json({ error: 'Error al desactivar localidad' });
    }
  }
}

module.exports = new LocalidadController();