const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class MetodoPagoRepository {
  async findAll() {
    return await prisma.metodoPago.findMany({
      where: {
        activo: true
      }
    });
  }

  async findById(id_metodo) {
    return await prisma.metodoPago.findUnique({
      where: {
        id_metodo
      }
    });
  }

  async create(data) {
    return await prisma.metodoPago.create({
      data
    });
  }

  async update(id_metodo, data) {
    return await prisma.metodoPago.update({
      where: {
        id_metodo
      },
      data
    });
  }

  async softDelete(id_metodo) {
    return await prisma.metodoPago.update({
      where: {
        id_metodo
      },
      data: {
        activo: false
      }
    });
  }
}

module.exports = new MetodoPagoRepository();