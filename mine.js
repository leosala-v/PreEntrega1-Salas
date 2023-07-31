const servicios = {
  botox: { precio: 100, descripcion: "Tratamiento de botox para rejuvenecer la piel." },
  acido: { precio: 200, descripcion: "Tratamiento con ácido hialurónico para hidratar la piel." },
  vitaminaC: { precio: 300, descripcion: "Tratamiento con vitamina C para mejorar la luminosidad de la piel." },
};

const eliminarProducto = (productosSeleccionados, servicio, cantidad = 1) => {
  const productoExistente = productosSeleccionados.find((producto) => producto.servicio === servicio);
  if (productoExistente) {
    productoExistente.cantidad -= cantidad;
    if (productoExistente.cantidad <= 0) {
      const index = productosSeleccionados.indexOf(productoExistente);
      productosSeleccionados.splice(index, 1);
    }
  }
};

const mostrarCarrito = (productosSeleccionados) => {
  console.log("Carrito de productos:");
  productosSeleccionados.forEach((producto) => {
    const { servicio, cantidad } = producto;
    const { precio, descripcion } = servicios[servicio];
    const precioTotal = calcularPrecioConDescuento(precio * cantidad, 10); 
    console.log(`- ${cantidad}x ${servicio}: ${descripcion} - Precio: $${precioTotal.toFixed(2)}`);
  });
  const precioTotalCarrito = productosSeleccionados.reduce((total, producto) => {
    const { servicio, cantidad } = producto;
    const { precio } = servicios[servicio];
    return total + calcularPrecioConDescuento(precio * cantidad, 10); 
  }, 0);
  console.log(`Precio total del carrito: $${precioTotalCarrito.toFixed(2)}`);
  return precioTotalCarrito;
};

const carritoProductos = [];

const interactuarConUsuario = () => {
  console.log("Bienvenido a la tienda de tratamientos estéticos.");
  while (true) {
    const opcion = prompt(
      "¿Qué deseas hacer?\n1. Agregar producto\n2. Eliminar producto\n3. Calcular precio con descuento\n4. Mostrar carrito \n5. Salir"
    ).toLowerCase();

    switch (opcion) {
      case "1":
        const servicioAgregar = prompt("Ingrese el servicio a agregar (botox, acido o vitaminaC):").toLowerCase();
        const cantidadAgregar = parseInt(prompt("Ingrese la cantidad a agregar:"));
        agregarProducto(carritoProductos, servicioAgregar, cantidadAgregar);
        console.log(`Se han agregado ${cantidadAgregar}x ${servicioAgregar} al carrito.`);
        break;

      case "2":
        const servicioEliminar = prompt("Ingrese el servicio a eliminar (botox, acido o vitaminaC):").toLowerCase();
        const cantidadEliminar = parseInt(prompt("Ingrese la cantidad a eliminar:"));
        eliminarProducto(carritoProductos, servicioEliminar, cantidadEliminar);
        console.log(`Se han eliminado ${cantidadEliminar}x ${servicioEliminar} del carrito.`);
        break;

      case "3":
        const descuento = parseFloat(prompt("Ingrese el descuento (por ejemplo, 15 para un 15% de descuento):"));
        const precioTotalConDescuento = mostrarCarrito(carritoProductos) - (mostrarCarrito(carritoProductos) * descuento / 100);
        console.log(`Precio total con descuento : $${precioTotalConDescuento.toFixed(2)}`);
        break;

      case "4":
        mostrarCarrito(carritoProductos);
        break;

      case "5":
        console.log("Gracias por utilizar nuestro servicio. ¡Hasta luego!");
        return;

      default:
        console.log("Opción inválida. Por favor, ingresa una opción válida.");
    }
  }
};

interactuarConUsuario();
