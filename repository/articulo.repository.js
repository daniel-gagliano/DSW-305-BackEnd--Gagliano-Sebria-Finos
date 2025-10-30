const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ArticuloRepository {
  async findAll() {
    return await prisma.articulo.findMany({
      where: { activo: true },
      include: {
        ar_ca: {
          include: {
            categoria: true
          }
        }
      }
    });
  }

  async findById(id) {
    return await prisma.articulo.findUnique({
      where: { id_articulo: id },
      include: {
        ar_ca: {
          include: {
            categoria: true
          }
        }
      }
    });
  }

  async create(data) {
    const { nombre, descripcion, stock, precio, categorias } = data;
    
    return await prisma.articulo.create({
      data: {
        nombre,
        descripcion,
        stock,
        precio,
        ar_ca: {
          create: categorias.map(id_categoria => ({
            categoria: {
              connect: { id_categoria }
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
  }

  async update(id, data) {
    const { nombre, descripcion, stock, precio, categorias } = data;
    
    // Eliminar relaciones existentes
    await prisma.categoria_Articulo.deleteMany({
      where: { id_articulo: id }
    });
    
    // Actualizar artículo con nuevas relaciones
    return await prisma.articulo.update({
      where: { id_articulo: id },
      data: {
        nombre,
        descripcion,
        stock,
        precio,
        ar_ca: {
          create: categorias.map(id_categoria => ({
            categoria: {
              connect: { id_categoria }
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
  }

  async softDelete(id) {
    // Eliminar relaciones
    await prisma.categoria_Articulo.deleteMany({
      where: { id_articulo: id }
    });
    
    // Soft delete
    return await prisma.articulo.update({
      where: { id_articulo: id },
      data: { activo: false }
    });
  }
}

module.exports = new ArticuloRepository();