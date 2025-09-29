// Script de prueba para crear un pedido en el backend
(async () => {
  try {
    const payload = {
      id_metodo: 1,
      nro_usuario: 1,
      id_provincia: 1,
      linea_pedido: [
        { id_articulo: 1, cantidad: 1, sub_total: 100 }
      ]
    };

    const res = await fetch('http://localhost:3000/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const contentType = res.headers.get('content-type') || '';
    let body;
    if (contentType.includes('application/json')) body = await res.json();
    else body = await res.text();

    console.log('STATUS:', res.status);
    console.log('RESPONSE BODY:');
    console.dir(body, { depth: 5 });
  } catch (err) {
    console.error('ERROR EN PETICIÓN DE PRUEBA:', err);
    process.exit(1);
  }
})();
