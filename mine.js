const servicios = {
  botox: 100,
  acido: 200,
  vitaminaC: 300,
};

const productos = [];

function calcularPrecioConDescuento(precio, descuento) {
  const porcentajeDescuento = descuento / 100;
  const montoDescuento = precio * porcentajeDescuento;
  const precioConDescuento = precio - montoDescuento;
  return precioConDescuento;
}

function agregarProducto(modelo, precio) {
  const producto = {
    modelo: modelo,
    precio: precio,
  };
  productos.push(producto);
}

function buscarProductoPorModelo(modelo) {
  return productos.find((producto) => producto.modelo === modelo);
}

function buscarProductosPorPrecio(precio) {
  return productos.filter((producto) => producto.precio === precio);
}

function calcularPrecioTotalCarrito() {
  let total = 0;
  productos.forEach((producto) => {
    total += producto.precio;
  });
  return total;
}

// Agregar productos de estética facial
agregarProducto("cremaFacial", 50);
agregarProducto("mascarilla", 25);

// Mostrar cuadro de precios y valor del carrito
function mostrarCuadroPrecios() {
  console.log("---- Precios ----");
  Object.entries(servicios).forEach(([producto, precio]) => {
    console.log(`${producto}: $${precio}`);
  });

  console.log("Productos en el carrito:");
  productos.forEach((producto) => {
    console.log(`${producto.modelo}: $${producto.precio}`);
  });

  const precioTotalCarrito = calcularPrecioTotalCarrito();
  console.log("---------------------------");
  console.log(`Total carrito: $${precioTotalCarrito}`);
}

mostrarCuadroPrecios();
