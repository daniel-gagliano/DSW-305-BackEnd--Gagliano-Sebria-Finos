(async () => {
  try {
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const pRes = await fetch('http://localhost:3000/provincias');
    const provincias = await pRes.json();
    console.log('PROVINCIAS:', JSON.stringify(provincias, null, 2));

    const lRes = await fetch('http://localhost:3000/localidades');
    const localidades = await lRes.json();
    console.log('LOCALIDADES:', JSON.stringify(localidades, null, 2));
  } catch (err) {
    console.error('ERROR AL CONSULTAR API:', err);
  }
})();
