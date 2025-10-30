const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class LocalidadRepository {
  async findAll() {
    return await prisma.localidad.findMany({
      where: {
        activo: true
      },
      include: {
        provincia: true
      }
    });
  }

  async findById(id_localidad) {
    return await prisma.localidad.findUnique({
      where: {
        id_localidad
      },
      include: {
        provincia: true
      }
    });
  }

  async findByProvincia(cod_provincia) {
    return await prisma.localidad.findMany({
      where: {
        cod_provincia,
        activo: true
      },
      include: {
        provincia: true
      }
    });
  }

  async create(data) {
    return await prisma.localidad.create({
      data,
      include: {
        provincia: true
      }
    });
  }

  async update(id_localidad, data) {
    return await prisma.localidad.update({
      where: {
        id_localidad
      },
      data,
      include: {
        provincia: true
      }
    });
  }

  async softDelete(id_localidad) {
    return await prisma.localidad.update({
      where: {
        id_localidad
      },
      data: {
        activo: false
      }
    });
  }

  async findProvinciaById(cod_provincia) {
    return await prisma.provincia.findUnique({
      where: {
        cod_provincia
      }
    });
  }
}

module.exports = new LocalidadRepository();