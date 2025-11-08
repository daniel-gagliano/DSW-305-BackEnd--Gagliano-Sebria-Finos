const articuloRepository = require('../repository/articulo.repository'); 

class ArticuloController {
  async obtenerTodos(req, res) {
    try {
      const articulos = await articuloRepository.findAll();
      res.json(articulos);
    } catch (error) {
      console.error('Error al obtener artículos:', error);
      res.status(500).json({ error: 'Error al obtener los artículos' });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const articulo = await articuloRepository.findById(id);
      
      if (!articulo) {
        return res.status(404).json({ error: 'Artículo no encontrado' });
      }
      
      res.json(articulo);
    } catch (error) {
      console.error('Error al obtener artículo:', error);
      res.status(500).json({ error: 'Error al obtener el artículo' });
    }
  }

  async crear(req, res) {
    try {
      const { nombre, descripcion, stock, precio, categorias } = req.body;
      
      // Validaciones de negocio
      if (!nombre || !descripcion || !stock || !precio) {
        return res.status(400).json({ 
          error: 'Todos los campos son obligatorios' 
        });
      }
      
      if (!categorias || categorias.length === 0) {
        return res.status(400).json({ 
          error: 'Debes seleccionar al menos una categoría' 
        });
      }
      
      if (stock < 0 || precio < 0) {
        return res.status(400).json({ 
          error: 'Stock y precio deben ser valores positivos' 
        });
      }
      
      const data = {
        nombre,
        descripcion,
        stock: parseInt(stock),
        precio: parseFloat(precio),
        categorias: categorias.map(id => parseInt(id)) //transforma en integer la id de las categorias que se asocian al articulo
      };
      
      const articulo = await articuloRepository.create(data);
      res.status(201).json(articulo);
    } catch (error) {
      console.error('Error al crear artículo:', error);
      res.status(500).json({ 
        error: 'Error al crear el artículo', 
        details: error.message 
      });
    }
  }

  async actualizar(req, res) {
    try {
      const id = parseInt(req.params.id); // req.params.id siempre es string y representa la id del articulo a actualizar
      const { nombre, descripcion, stock, precio, categorias } = req.body;
      
      // Validar que el artículo exista
      const articuloExistente = await articuloRepository.findById(id);
      if (!articuloExistente) {
        return res.status(404).json({ error: 'Artículo no encontrado' });
      }
      
      // Validaciones de negocio
      if (!categorias || categorias.length === 0) {
        return res.status(400).json({ 
          error: 'Debes seleccionar al menos una categoría' 
        });
      }
      
      if (stock < 0 || precio < 0) {
        return res.status(400).json({ 
          error: 'Stock y precio deben ser valores positivos' 
        });
      }
      
      const data = {
        nombre,
        descripcion,
        stock: parseInt(stock),
        precio: parseFloat(precio),
        categorias: categorias.map(id => parseInt(id))
      };
      
      const articulo = await articuloRepository.update(id, data);
      res.json(articulo);
    } catch (error) {
      console.error('Error al actualizar artículo:', error);
      res.status(500).json({ 
        error: 'Error al actualizar el artículo', 
        details: error.message 
      });
    }
  }

  async eliminar(req, res) {
    try {
      const id = parseInt(req.params.id);
      
      // Validar que el artículo exista
      const articuloExistente = await articuloRepository.findById(id);
      if (!articuloExistente) {
        return res.status(404).json({ error: 'Artículo no encontrado' });
      }
      
      await articuloRepository.softDelete(id);
      res.json({ mensaje: 'Artículo desactivado correctamente' });
    } catch (error) {
      console.error('Error al eliminar artículo:', error);
      res.status(500).json({ error: 'Error al eliminar el artículo' });
    }
  }
}

module.exports = new ArticuloController();