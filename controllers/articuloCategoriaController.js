const articuloCategoriaRepository = require('../repository/articuloCategoria.repository');

class ArticuloCategoriaController {
  async listarTodas(req, res) {
    try {
      const relaciones = await articuloCategoriaRepository.findAll();
      res.json(relaciones);
    } catch (error) {
      res.status(500).json({ error: error.message || 'Error al obtener relaciones' });
    }
  }

  async obtenerPorIds(req, res) {
    try {
      const id_categoria = parseInt(req.params.id_categoria);
      const id_articulo = parseInt(req.params.id_articulo);
      
      const relacion = await articuloCategoriaRepository.findByIds(id_categoria, id_articulo);
      
      if (!relacion) {
        return res.status(404).json({ error: 'Relación no encontrada' });
      }
      
      res.json(relacion);
    } catch (error) {
      res.status(500).json({ error: error.message || 'Error al obtener relación' });
    }
  }

  async crear(req, res) {
    try {
      const { id_categoria, id_articulo } = req.body;
      
      // Validaciones
      if (!id_categoria || !id_articulo) {
        return res.status(400).json({ 
          error: 'id_categoria e id_articulo son obligatorios' 
        });
      }
      
      // Verificar si la relación ya existe
      const relacionExistente = await articuloCategoriaRepository.findByIds(
        parseInt(id_categoria),
        parseInt(id_articulo)
      );
      
      if (relacionExistente) {
        return res.status(400).json({ 
          error: 'Esta relación ya existe' 
        });
      }
      
      const data = {
        id_categoria: parseInt(id_categoria),
        id_articulo: parseInt(id_articulo)
      };
      
      const created = await articuloCategoriaRepository.create(data);
      res.status(201).json(created);
    } catch (error) {
      res.status(500).json({ error: error.message || 'Error al crear relación' });
    }
  }

  async eliminar(req, res) {
    try {
      const id_categoria = parseInt(req.params.id_categoria);
      const id_articulo = parseInt(req.params.id_articulo);
      
      // Verificar que la relación existe
      const relacionExistente = await articuloCategoriaRepository.findByIds(
        id_categoria,
        id_articulo
      );
      
      if (!relacionExistente) {
        return res.status(404).json({ error: 'Relación no encontrada' });
      }
      
      await articuloCategoriaRepository.delete(id_categoria, id_articulo);
      
      const restantes = await articuloCategoriaRepository.findAll();
      res.json(restantes);
    } catch (error) {
      res.status(500).json({ error: error.message || 'Error al eliminar relación' });
    }
  }
}

module.exports = new ArticuloCategoriaController();