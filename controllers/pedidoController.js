const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();  
const prisma = new PrismaClient();

console.log('pedidoController.js cargado (versión con usuario.connect)');

// =======================
// CREAR PEDIDO
// =======================
router.post('/', async (req, res) => {
  const { id_metodo, nro_usuario, id_localidad, id_provincia, linea_pedido, direccion } = req.body; // ← AGREGADO direccion

  // validaciones mínimas en entrada
  if (!id_metodo || !nro_usuario || !Array.isArray(linea_pedido) || linea_pedido.length === 0) {
    return res.status(400).json({ error: 'id_metodo, nro_usuario y linea_pedido (no vacío) son obligatorios' });
  }

  try {
    console.log('POST /pedidos body:', req.body);
    console.log('Dirección recibida:', direccion); // ← AGREGADO LOG

    // validar usuario
    const usuario = await prisma.user.findUnique({ where: { id: Number(nro_usuario) } });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    // validar método de pago
    const metodo = await prisma.metodoPago.findUnique({ where: { id_metodo: Number(id_metodo) } });
    if (!metodo) return res.status(404).json({ error: 'Método de pago no encontrado' });

    // resolver localidad (por id_localidad o por id_provincia)
    let localidad = null;
    if (!id_localidad && id_provincia) {
      localidad = await prisma.localidad.findFirst({
        where: { cod_provincia: Number(id_provincia) },
        include: { provincia: true }
      });
      if (!localidad) return res.status(404).json({ error: 'No hay localidades para la provincia indicada' });
    } else {
      localidad = await prisma.localidad.findUnique({
        where: { id_localidad: Number(id_localidad) },
        include: { provincia: true }
      });
      if (!localidad) return res.status(404).json({ error: 'Localidad no encontrada' });
    }

    const id_localidad_usar = Number(id_localidad) || (localidad && localidad.id_localidad);
    if (!id_localidad_usar) return res.status(400).json({ error: 'No se pudo determinar la localidad para el pedido' });

    // ========== VALIDAR STOCK ANTES DE CREAR PEDIDO ==========
    for (const lp of linea_pedido) {
      const articulo = await prisma.articulo.findUnique({ 
        where: { id_articulo: Number(lp.id_articulo) } 
      });
      
      if (!articulo) {
        return res.status(404).json({ error: `Artículo ${lp.id_articulo} no encontrado` });
      }
      
      if (articulo.stock < Number(lp.cantidad)) {
        return res.status(400).json({ 
          error: `Stock insuficiente para ${articulo.nombre}. Disponible: ${articulo.stock}, solicitado: ${lp.cantidad}` 
        });
      }
    }
    // ========== FIN VALIDACIÓN STOCK ==========

    // validar artículos y recalcular subtotales desde DB para evitar inconsistencias
    let subtotal = 0;
    const lineasCreate = [];

    for (const lp of linea_pedido) {
      const articulo = await prisma.articulo.findUnique({ where: { id_articulo: Number(lp.id_articulo) } });
      const sub_total_calculado = Number(articulo.precio) * Number(lp.cantidad);
      subtotal += sub_total_calculado;
      lineasCreate.push({
        id_articulo: Number(lp.id_articulo),
        cantidad: Number(lp.cantidad),
        sub_total: sub_total_calculado
      });
    }

    const costo_envio = localidad.provincia?.costo_envio || 0;
    const precio_total = subtotal + costo_envio;

    // crear pedido con relaciones anidadas
    const dataToCreate = {
      precio_total,
      direccion: direccion || '', // ← AGREGADA ESTA LÍNEA
      usuario: { connect: { id: Number(nro_usuario) } },
      metodo_pago: { connect: { id_metodo: Number(id_metodo) } },
      localidad: { connect: { id_localidad: Number(id_localidad_usar) } },
      linea_pedido: {
        create: lineasCreate
      }
    };

    console.log('DATA a pasar a prisma.pedido.create:', JSON.stringify(dataToCreate, null, 2));

    const pedido = await prisma.pedido.create({
      data: dataToCreate,
      include: {
        linea_pedido: {
          include: {
            articulo: true
          }
        },
        localidad: { include: { provincia: true } }
      }
    });

    // ========== DESCONTAR STOCK DESPUÉS DE CREAR PEDIDO ==========
    for (const lp of linea_pedido) {
      await prisma.articulo.update({
        where: { id_articulo: Number(lp.id_articulo) },
        data: {
          stock: {
            decrement: Number(lp.cantidad)
          }
        }
      });
      console.log(`Stock actualizado para artículo ${lp.id_articulo}: -${lp.cantidad}`);
    }
    // ========== FIN DESCUENTO STOCK ==========

    res.status(201).json(pedido);
  } catch (error) {
    console.error('ERROR AL CREAR PEDIDO:', error.stack || error);
    res.status(500).json({ error: 'Error interno al crear pedido', details: error.message });
  }
});

// =======================
// LISTAR TODOS LOS PEDIDOS
// =======================
router.get('/', async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        linea_pedido: {
          include: {
            articulo: true
          }
        },
        localidad: { include: { provincia: true } }
      }
    });

    const pedidosConTotal = pedidos.map(pedido => {
      const totalLineas = pedido.linea_pedido.reduce((acc, l) => acc + l.sub_total, 0);
      const precio_envio = pedido.localidad?.provincia?.costo_envio || 0;
      return { ...pedido, precio_total: totalLineas + precio_envio, precio_envio };
    });

    res.json(pedidosConTotal);
  } catch (error) {
    console.error('ERROR AL OBTENER PEDIDOS:', error);
    res.status(500).json({ error: error.message });
  }
});

// =======================
// OBTENER PEDIDO POR ID
// =======================
router.get('/:id', async (req, res) => {
  try {
    const pedido = await prisma.pedido.findUnique({
      where: { nro_pedido: parseInt(req.params.id) },
      include: {
        linea_pedido: {
          include: {
            articulo: true
          }
        },
        localidad: { include: { provincia: true } }
      }
    });

    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });

    const totalLineas = pedido.linea_pedido.reduce((acc, l) => acc + l.sub_total, 0);
    const precio_envio = pedido.localidad?.provincia?.costo_envio || 0;
    const precio_total = totalLineas + precio_envio;

    res.json({ ...pedido, precio_total, precio_envio });
  } catch (error) {
    console.error('ERROR AL OBTENER PEDIDO:', error);
    res.status(500).json({ error: error.message });
  }
});

// =======================
// OBTENER PEDIDOS DE UN USUARIO
// =======================
router.get('/usuario/:nro_usuario', async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      where: { nro_usuario: parseInt(req.params.nro_usuario) },
      include: {
        linea_pedido: {
          include: {
            articulo: true
          }
        },
        localidad: { include: { provincia: true } }
      }
    });

    const pedidosConTotal = pedidos.map(pedido => {
      const totalLineas = pedido.linea_pedido.reduce((acc, l) => acc + l.sub_total, 0);
      const precio_envio = pedido.localidad?.provincia?.costo_envio || 0;
      return { ...pedido, precio_total: totalLineas + precio_envio, precio_envio };
    });

    res.json(pedidosConTotal);
  } catch (error) {
    console.error('ERROR AL OBTENER PEDIDOS DEL USUARIO:', error);
    res.status(500).json({ error: error.message });
  }
});

// =======================
// ACTUALIZAR PEDIDO
// =======================
router.put('/:id', async (req, res) => {
  const { id_metodo, id_localidad, linea_pedido } = req.body;

  try {
    const localidad = await prisma.localidad.findUnique({
      where: { id_localidad },
      include: { provincia: true }
    });

    if (!localidad) {
      return res.status(404).json({ error: "Localidad no encontrada" });
    }

    const subtotal = (linea_pedido || []).reduce((acc, lp) => acc + lp.sub_total, 0);
    const costo_envio = localidad.provincia.costo_envio || 0;
    const precio_total = subtotal + costo_envio;

    const pedido = await prisma.pedido.update({
      where: { nro_pedido: parseInt(req.params.id) },
      data: {
        id_metodo,
        id_localidad,
        precio_total
      },
      include: {
        linea_pedido: {
          include: {
            articulo: true
          }
        },
        localidad: { include: { provincia: true } }
      }
    });

    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar pedido' });
  }
});

// =======================
// AGREGAR ESTADO A UN PEDIDO
// =======================
router.post('/:id/estado', async (req, res) => {
  const { descripcion } = req.body;
  try {
    const estado = await prisma.estado_Pedido.create({
      data: {
        nro_pedido: parseInt(req.params.id),
        descripcion
      }
    });
    res.status(201).json(estado);
  } catch (error) {
    console.error('ERROR AL AGREGAR ESTADO:', error);
    res.status(500).json({ error: error.message });
  }
});

// =======================
// ELIMINAR PEDIDO
// =======================
router.delete('/:id', async (req, res) => {
  try {
    await prisma.pedido.delete({
      where: { nro_pedido: parseInt(req.params.id) }
    });
    res.json({ mensaje: 'Pedido eliminado' });
  } catch (error) {
    console.error('ERROR AL ELIMINAR PEDIDO:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
