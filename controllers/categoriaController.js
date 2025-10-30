const categoriaRepository = require('../repository/categoria.repository');

class CategoriaController {
  async listarTodas(req, res) {
    try {
      const categorias = await categoriaRepository.findAll();
      res.json(categorias);
    } catch (error) {
      console.error('ERROR AL OBTENER CATEGORÍAS:', error);
      res.status(500).json({ error: 'Error al obtener categorías' });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const id_categoria = parseInt(req.params.id);
      const categoria = await categoriaRepository.findById(id_categoria);

      if (!categoria) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }

      res.json(categoria);
    } catch (error) {
      console.error('ERROR AL OBTENER CATEGORÍA:', error);
      res.status(500).json({ error: 'Error al obtener categoría' });
    }
  }

  async crear(req, res) {
    try {
      const { nom_categoria, desc_categoria } = req.body;

      // Validaciones
      if (!nom_categoria || !desc_categoria) {
        return res.status(400).json({ 
          error: 'Nombre y descripción son obligatorios' 
        });
      }

      const data = {
        nom_categoria,
        desc_categoria
      };

      const categoria = await categoriaRepository.create(data);
      res.status(201).json(categoria);
    } catch (error) {
      console.error('ERROR AL CREAR CATEGORÍA:', error);
      res.status(500).json({ 
        error: 'Error al crear categoría',
        details: error.message 
      });
    }
  }

  async actualizar(req, res) {
    try {
      const id_categoria = parseInt(req.params.id);
      const { nom_categoria, desc_categoria } = req.body;

      // Verificar que la categoría existe
      const categoriaExistente = await categoriaRepository.findById(id_categoria);
      if (!categoriaExistente) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }

      // Validaciones
      if (!nom_categoria || !desc_categoria) {
        return res.status(400).json({ 
          error: 'Nombre y descripción son obligatorios' 
        });
      }

      const data = {
        nom_categoria,
        desc_categoria
      };

      const categoria = await categoriaRepository.update(id_categoria, data);
      res.json(categoria);
    } catch (error) {
      console.error('ERROR AL ACTUALIZAR CATEGORÍA:', error);
      res.status(500).json({ 
        error: 'Error al actualizar categoría',
        details: error.message 
      });
    }
  }

  async eliminar(req, res) {
    try {
      const id_categoria = parseInt(req.params.id);

      // Verificar que la categoría existe
      const categoriaExistente = await categoriaRepository.findById(id_categoria);
      if (!categoriaExistente) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }

      await categoriaRepository.softDelete(id_categoria);
      res.json({ mensaje: 'Categoría desactivada correctamente' });
    } catch (error) {
      console.error('ERROR AL DESACTIVAR CATEGORÍA:', error);
      res.status(500).json({ error: 'Error al desactivar la categoría' });
    }
  }
}

module.exports = new CategoriaController();