const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PedidoRepository {
  async findAll() {
    return await prisma.pedido.findMany({
      include: {
        usuario: true,
        linea_pedido: {
          include: {
            articulo: true
          }
        },
        localidad: { 
          include: { 
            provincia: true 
          } 
        }
      }
    });
  }

  async findById(nro_pedido) {
    return await prisma.pedido.findUnique({
      where: { nro_pedido },
      include: {
        usuario: true,
        linea_pedido: {
          include: {
            articulo: true
          }
        },
        localidad: { 
          include: { 
            provincia: true 
          } 
        }
      }
    });
  }

  async findByUserId(nro_usuario) {
    return await prisma.pedido.findMany({
      where: { nro_usuario },
      include: {
        usuario: true,
        linea_pedido: {
          include: {
            articulo: true
          }
        },
        localidad: { 
          include: { 
            provincia: true 
          } 
        }
      }
    });
  }

  async create(data) {
    return await prisma.pedido.create({
      data,
      include: {
        usuario: true,
        linea_pedido: {
          include: {
            articulo: true
          }
        },
        localidad: { 
          include: { 
            provincia: true 
          } 
        }
      }
    });
  }

  async update(nro_pedido, data) {
    return await prisma.pedido.update({
      where: { nro_pedido },
      data,
      include: {
        usuario: true,
        linea_pedido: {
          include: {
            articulo: true
          }
        },
        localidad: { 
          include: { 
            provincia: true 
          } 
        }
      }
    });
  }

  async delete(nro_pedido) {
    return await prisma.pedido.delete({
      where: { nro_pedido }
    });
  }

  // Métodos auxiliares para validaciones
  async findUserById(id) {
    return await prisma.user.findUnique({ where: { id } });
  }

  async findMetodoPagoById(id_metodo) {
    return await prisma.metodoPago.findUnique({ where: { id_metodo } });
  }

  async findLocalidadById(id_localidad) {
    return await prisma.localidad.findUnique({
      where: { id_localidad },
      include: { provincia: true }
    });
  }

  async findLocalidadByProvincia(cod_provincia) {
    return await prisma.localidad.findFirst({
      where: { cod_provincia },
      include: { provincia: true }
    });
  }

  async findArticuloById(id_articulo) {
    return await prisma.articulo.findUnique({ 
      where: { id_articulo } 
    });
  }

  async updateArticuloStock(id_articulo, cantidad) {
    return await prisma.articulo.update({
      where: { id_articulo },
      data: {
        stock: {
          decrement: cantidad
        }
      }
    });
  }

  async createEstadoPedido(data) {
    return await prisma.estado_Pedido.create({
      data
    });
  }

  async deleteCategoriaArticuloByPedido(id_articulo) {
    return await prisma.categoria_Articulo.deleteMany({
      where: { id_articulo }
    });
  }
}

module.exports = new PedidoRepository();