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
            categoria: true //categoria tiene que estar en true porque es una relacion N:M
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
        ar_ca: { //cuando se crea un articulo TAMBIEN se crea un registro en la tabla ar_ca
          create: categorias.map(id_categoria => ({ //por cada id de categoria que llega en el array categorias, se crea un objeto con la relacion
            categoria: {
              connect: { id_categoria } //por cada registro en ar_ca conecta con una categoria en base a su id
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
    const { nombre, descripcion, stock, precio, categorias } = data; //esto "desarma" el objeto data para obtener las propiedades individuales
    
    // Eliminar relaciones existentes
    await prisma.categoria_Articulo.deleteMany({ //elimina las relaciones anteriores para luego crear las nuevas y que no queden relaciones "sucias"
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