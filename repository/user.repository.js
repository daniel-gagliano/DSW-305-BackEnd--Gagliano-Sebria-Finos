const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); //instancia de PrismaClient para interactuar con la base de datos

class UserRepository {
  async findAll() {
    return await prisma.user.findMany(); 
  }

  async findById(id) {
    return await prisma.user.findUnique({
      where: { id }
    });
  }

  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  async create(data) {
    return await prisma.user.create({ 
      data
    });
  }

  async update(id, data) {
    return await prisma.user.update({
      where: { id }, //id es un valor primitivo, un valor simple
      data //data es un objeto porque puede tener varios campos para actualizar
    });
  }

  async delete(id) {
    return await prisma.user.delete({
      where: { id }
    });
  }
}

module.exports = new UserRepository();