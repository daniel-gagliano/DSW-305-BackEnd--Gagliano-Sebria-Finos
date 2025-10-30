const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ArticuloCategoriaRepository {
  async findAll() {
    return await prisma.categoria_Articulo.findMany();
  }

  async findByIds(id_categoria, id_articulo) {
    return await prisma.categoria_Articulo.findUnique({
      where: {
        id_categoria_id_articulo: {
          id_categoria,
          id_articulo
        }
      }
    });
  }

  async create(data) {
    return await prisma.categoria_Articulo.create({
      data
    });
  }

  async delete(id_categoria, id_articulo) {
    return await prisma.categoria_Articulo.delete({
      where: {
        id_categoria_id_articulo: {
          id_categoria,
          id_articulo
        }
      }
    });
  }
}

module.exports = new ArticuloCategoriaRepository();