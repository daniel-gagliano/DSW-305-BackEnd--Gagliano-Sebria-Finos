const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ProvinciaRepository {
  async findAll() {
    return await prisma.provincia.findMany({
      where: {
        activo: true
      },
      include: {
        localidades: true
      }
    });
  }

  async findById(cod_provincia) {
    return await prisma.provincia.findUnique({
      where: {
        cod_provincia
      },
      include: {
        localidades: true
      }
    });
  }

  async create(data) {
    return await prisma.provincia.create({
      data
    });
  }

  async update(cod_provincia, data) {
    return await prisma.provincia.update({
      where: {
        cod_provincia
      },
      data
    });
  }

  async softDelete(cod_provincia) {
    return await prisma.provincia.update({
      where: {
        cod_provincia
      },
      data: {
        activo: false
      }
    });
  }
}

module.exports = new ProvinciaRepository();