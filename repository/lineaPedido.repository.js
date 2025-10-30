const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class LineaPedidoRepository {
  async findAll(filters = {}) {
    return await prisma.linea_Pedido.findMany({
      where: filters,
      include: {
        articulo: true,
        pedido: true
      }
    });
  }

  async findByIds(nro_pedido, id_articulo) {
    return await prisma.linea_Pedido.findUnique({
      where: {
        nro_pedido_id_articulo: {
          nro_pedido,
          id_articulo
        }
      },
      include: {
        articulo: true,
        pedido: true
      }
    });
  }

  async create(data) {
    return await prisma.linea_Pedido.create({
      data,
      include: {
        articulo: true,
        pedido: true
      }
    });
  }

  async update(nro_pedido, id_articulo, data) {
    return await prisma.linea_Pedido.update({
      where: {
        nro_pedido_id_articulo: {
          nro_pedido,
          id_articulo
        }
      },
      data,
      include: {
        articulo: true,
        pedido: true
      }
    });
  }

  async delete(nro_pedido, id_articulo) {
    return await prisma.linea_Pedido.delete({
      where: {
        nro_pedido_id_articulo: {
          nro_pedido,
          id_articulo
        }
      }
    });
  }

  async findArticuloById(id_articulo) {
    return await prisma.articulo.findUnique({
      where: { id_articulo }
    });
  }

  async findPedidoById(nro_pedido) {
    return await prisma.pedido.findUnique({
      where: { nro_pedido }
    });
  }
}

module.exports = new LineaPedidoRepository();