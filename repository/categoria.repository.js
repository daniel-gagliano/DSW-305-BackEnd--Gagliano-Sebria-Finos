const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CategoriaRepository {
  async findAll() {
    return await prisma.categoria.findMany({
      where: {
        activo: true
      }
    });
  }

  async findById(id_categoria) {
    return await prisma.categoria.findUnique({
      where: {
        id_categoria
      }
    });
  }

  async create(data) {
    return await prisma.categoria.create({
      data
    });
  }

  async update(id_categoria, data) {
    return await prisma.categoria.update({
      where: {
        id_categoria
      },
      data
    });
  }

  async softDelete(id_categoria) {
    return await prisma.categoria.update({
      where: {
        id_categoria
      },
      data: {
        activo: false
      }
    });
  }
}

module.exports = new CategoriaRepository();