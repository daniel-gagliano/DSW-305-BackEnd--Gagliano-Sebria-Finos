const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class DescuentoRepository {
  async findAll() {
    return await prisma.descuento.findMany({
      where: {
        activo: true
      }
    });
  }

  async findById(cod_descuento) {
    return await prisma.descuento.findUnique({
      where: {
        cod_descuento
      }
    });
  }

  async create(data) {
    return await prisma.descuento.create({
      data
    });
  }

  async update(cod_descuento, data) {
    return await prisma.descuento.update({
      where: {
        cod_descuento
      },
      data
    });
  }

  async softDelete(cod_descuento) {
    return await prisma.descuento.update({
      where: {
        cod_descuento
      },
      data: {
        activo: false
      }
    });
  }
}

module.exports = new DescuentoRepository();