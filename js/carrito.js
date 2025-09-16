// Variables
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listarArticulo = document.querySelector('#lista-Articulo');
let articulosCarrito = [];

// Esto se hace antes de cargar linea_pedido. Una vez el carrito esté armado es cuando se crea la relación linea_pedido entre articulo y pedido. T.

cargarEventListeners();
function cargarEventListeners(){
    //Agregar cursos al carrito
    listarArticulo.addEventListener('click', agregarArticulo);
    
    //Eliminar cursos del carrito
    carrito.addEventListener('click', eliminarArticulo);

    //Vaciar carrito totalmente
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []; //reset arreglo
        limpiarHTML(); 
    })
}



//Funciones
function agregarArticulo(e) {
    e.preventDefault();

   if( e.target.classList.contains('agregar-carrito')){
        const Articuloelect = e.target.parentElement.parentElement;
        leerDatosArticulo(Articuloelect)
   }   
}


//Eliminar un articulo
function eliminarArticulo(e){

    if(e.target.classList.contains('borrar-Articulo')) {
        const articuloId = e.target.getAttribute('data-id');

        //elimina del arreglo un articulo por id
        articulosCarrito = articulosCarrito.filter(Articulo => Articulo.id !== articuloId)
        carritoHMTL(); //Llamado de funcion para limpiar el articulo
    }
}


//Lee el contenido del Articulo que se clickea y extrae la info
function leerDatosArticulo(Articulo){
    console.log(Articulo);

    const infoArticulo = {
        imagen: Articulo.querySelector('img').src,
        nombre: Articulo.querySelector('h4').textContent,
        precio: Articulo.querySelector('.precio span').textContent,
        id: Articulo.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    } 

    //Chequea si existe el elemento en el carrito

    const existe = articulosCarrito.some(Articulo => Articulo.id === infoArticulo.id);
    if(existe){
        //Si existe sumar 1 a cant
        const Articulos = articulosCarrito.map( Articulo => {
            if(Articulo.id === infoArticulo.id) {
                Articulo.cantidad ++
                return Articulo; //retorna el obj actualizado
            } else {
                return Articulo; //retorna el obj sin duplicados
            }
        });
        articulosCarrito = [...Articulos]
    
    } else {
            //Agrega elementos al arreglo del carrito
            articulosCarrito = [...articulosCarrito, infoArticulo];
    }


    console.log(infoArticulo);
    console.log(articulosCarrito);
    carritoHMTL();
}

function carritoHMTL() {

    //Limpia el carrito
    limpiarHTML();

    //Agrega el articulo al carrito
    articulosCarrito.forEach( Articulo => {
        const {imagen, nombre, precio, cantidad, id} = Articulo;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src=" ${imagen}" width="100">
            </td>
            <td> ${nombre} </td> 
            <td> ${precio} </td>
            <td> ${cantidad} </td>
            <td>
                <a href="#" class="borrar-Articulo" 
                data-id="${id}" > X </a>
            </td>
        `;
        contenedorCarrito.appendChild(row);
    }) ;
} 

function limpiarHTML() {
    //limpia el carrito mientras exista un elemnto para evitar copias innecesarias
   while(contenedorCarrito.firstChild){
    contenedorCarrito.removeChild(contenedorCarrito.firstChild)
   }
}

