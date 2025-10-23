const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();

// Obtener todos los artículos CON sus categorías
router.get('', async (req, res) => {
  try {
    const articulos = await prisma.articulo.findMany({
      where: {
        activo: true
      },
      include: {
        ar_ca: {
          include: {
            categoria: true
          }
        }
      }
    });
    res.json(articulos);
  } catch (error) {
    console.error('Error al obtener artículos:', error);
    res.status(500).json({ error: 'Error al obtener los artículos' });
  }
});

// Obtener un artículo por ID CON sus categorías
router.get('/:id', async (req, res) => {
  try {
    const articulo = await prisma.articulo.findUnique({
      where: {
        id_articulo: parseInt(req.params.id)
      },
      include: {
        ar_ca: {
          include: {
            categoria: true
          }
        }
      }
    });
    res.json(articulo);
  } catch (error) {
    console.error('Error al obtener artículo:', error);
    res.status(500).json({ error: 'Error al obtener el artículo' });
  }
});

// Crear un nuevo artículo CON categorías
router.post('', async (req, res) => {
  try {
    const { nombre, descripcion, stock, precio, categorias } = req.body;
    
    // Validar que vengan categorías
    if (!categorias || categorias.length === 0) {
      return res.status(400).json({ error: 'Debes seleccionar al menos una categoría' });
    }
    
    const articulo = await prisma.articulo.create({
      data: {
        nombre,
        descripcion,
        stock: parseInt(stock),
        precio: parseFloat(precio),
        ar_ca: {
          create: categorias.map(id_categoria => ({
            categoria: {
              connect: { id_categoria: parseInt(id_categoria) }
            }
          }))
        }
      },
      include: {
        ar_ca: {
          include: {
            categoria: true
          }
        }
      }
    });
    
    res.status(201).json(articulo);
  } catch (error) {
    console.error('Error al crear artículo:', error);
    res.status(500).json({ error: 'Error al crear el artículo', details: error.message });
  }
});

// Actualizar un artículo existente CON categorías
router.put('/:id', async (req, res) => {
  try {
    const { nombre, descripcion, stock, precio, categorias } = req.body;
    const id_articulo = parseInt(req.params.id);
    
    // Validar que vengan categorías
    if (!categorias || categorias.length === 0) {
      return res.status(400).json({ error: 'Debes seleccionar al menos una categoría' });
    }
    
    // Primero eliminar las relaciones existentes
    await prisma.categoria_Articulo.deleteMany({
      where: {
        id_articulo: id_articulo
      }
    });
    
    // Actualizar el artículo y crear nuevas relaciones
    const articulo = await prisma.articulo.update({
      where: {
        id_articulo: id_articulo
      },
      data: {
        nombre,
        descripcion,
        stock: parseInt(stock),
        precio: parseFloat(precio),
        ar_ca: {
          create: categorias.map(id_categoria => ({
            categoria: {
              connect: { id_categoria: parseInt(id_categoria) }
            }
          }))
        }
      },
      include: {
        ar_ca: {
          include: {
            categoria: true
          }
        }
      }
    });
    
    res.json(articulo);
  } catch (error) {
    console.error('Error al actualizar artículo:', error);
    res.status(500).json({ error: 'Error al actualizar el artículo', details: error.message });
  }
});

// Eliminar un artículo
router.delete('/:id', async (req, res) => {
  try {
    const id_articulo = parseInt(req.params.id);
    
    // Primero eliminar las relaciones en Categoria_Articulo
    await prisma.categoria_Articulo.deleteMany({
      where: {
        id_articulo: id_articulo
      }
    });
    
    // Soft delete: marcar como inactivo
    const articulo = await prisma.articulo.update({
      where: {
        id_articulo: id_articulo
      },
      data: {
        activo: false
      }
    });
    
    res.json({ mensaje: 'Artículo desactivado correctamente' });
  } catch (error) {
    console.error('Error al eliminar artículo:', error);
    res.status(500).json({ error: 'Error al eliminar el artículo' });
  }
});

module.exports = router;