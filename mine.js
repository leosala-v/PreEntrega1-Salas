const servicios = {
  botox: { precio: 100, descripcion: "Tratamiento de botox para rejuvenecer la piel." },
  acido: { precio: 200, descripcion: "Tratamiento con ácido hialurónico para hidratar la piel." },
  vitaminaC: { precio: 300, descripcion: "Tratamiento con vitamina C para mejorar la luminosidad de la piel." },
};

const carritoProductos = [];

const carritoHTML = document.getElementById("carrito");
const agregarBtns = document.querySelectorAll(".agregar-producto");
const eliminarBtn = document.getElementById("eliminarBtn");
const mostrarBtn = document.getElementById("mostrarBtn");
const descuentoBtn = document.getElementById("descuentoBtn");
const salirBtn = document.getElementById("salirBtn");
const precioActualizadoElement = document.getElementById("precioActualizado");

const calcularPrecioConDescuento = (precio, descuento) => precio * (1 - descuento / 100);

const cargarCarritoDesdeLocalStorage = () => {
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    const carritoParseado = JSON.parse(carritoGuardado);
    carritoProductos.push(...carritoParseado);
  }
};

const guardarCarritoEnLocalStorage = () => {
  localStorage.setItem("carrito", JSON.stringify(carritoProductos));
};

const agregarProducto = (productosSeleccionados, servicio, cantidad) => {
  const productoExistente = productosSeleccionados.find((producto) => producto.servicio === servicio);
  if (productoExistente) {
    productoExistente.cantidad += cantidad;
  } else {
    productosSeleccionados.push({ servicio, cantidad });
  }
};

const eliminarProducto = (productosSeleccionados, servicio, cantidad = 1) => {
  const productoExistente = productosSeleccionados.find((producto) => producto.servicio === servicio);
  if (productoExistente) {
    productoExistente.cantidad -= cantidad;
    if (productoExistente.cantidad <= 0) {
      const index = productosSeleccionados.indexOf(productoExistente);
      index !== -1 && productosSeleccionados.splice(index, 1);
    }
  }
};

const mostrarCarrito = (productosSeleccionados) => {
  console.log("Carrito de productos:");
  productosSeleccionados.forEach((producto) => {
    const { servicio, cantidad } = producto;
    const { precio, descripcion } = servicios[servicio];
    const precioTotal = calcularPrecioConDescuento(precio * cantidad, 10); // Supongamos un descuento del 10%
    console.log(`- ${cantidad}x ${servicio}: ${descripcion} - Precio: $${precioTotal.toFixed(2)}`);
  });
  const precioTotalCarrito = productosSeleccionados.reduce((total, producto) => {
    const { servicio, cantidad } = producto;
    const { precio } = servicios[servicio];
    return total + calcularPrecioConDescuento(precio * cantidad, 10); // Supongamos un descuento del 10%
  }, 0);
  console.log(`Precio total del carrito: $${precioTotalCarrito.toFixed(2)}`);
  return precioTotalCarrito;
};

window.addEventListener("load", () => {
  cargarCarritoDesdeLocalStorage();
  actualizarPrecioTotal();
});

agregarBtns.forEach((boton) => {
  boton.addEventListener("click", () => {
    const servicioAgregar = boton.getAttribute("data-servicio");
    const cantidadAgregar = parseInt(prompt(`Ingrese la cantidad de ${servicioAgregar} a agregar:`));
    
    if (!isNaN(cantidadAgregar) && cantidadAgregar > 0) {
      agregarProducto(carritoProductos, servicioAgregar, cantidadAgregar);
      
      const { descripcion } = servicios[servicioAgregar];
      const li = document.createElement("li");
      li.textContent = `${cantidadAgregar}x ${servicioAgregar}: ${descripcion}`;
      carritoHTML.appendChild(li);
      
      guardarCarritoEnLocalStorage();
      actualizarPrecioTotal();
      alert(`Se han agregado ${cantidadAgregar}x ${servicioAgregar} al carrito.`);
    } else {
      alert("Por favor, ingresa una cantidad válida.");
    }
  });
});

eliminarBtn.addEventListener("click", () => {
  const servicioEliminar = prompt("Ingrese el servicio a eliminar (botox, acido o vitaminaC):").toLowerCase();
  const cantidadEliminar = parseInt(prompt("Ingrese la cantidad a eliminar:"));
  if (!isNaN(cantidadEliminar) && cantidadEliminar > 0) {
    eliminarProducto(carritoProductos, servicioEliminar, cantidadEliminar);
    guardarCarritoEnLocalStorage();
    actualizarPrecioTotal();
    alert(`Se han eliminado ${cantidadEliminar}x ${servicioEliminar} del carrito.`);
  } else {
    alert("Por favor, ingresa una cantidad válida.");
  }
});

mostrarBtn.addEventListener("click", () => {
  carritoHTML.innerHTML = "";
  mostrarCarrito(carritoProductos);
});

descuentoBtn.addEventListener("click", () => {
  const descuento = parseFloat(prompt("Ingrese el descuento (por ejemplo, 15 para un 15% de descuento):"));
  const precioTotal = mostrarCarrito(carritoProductos);
  const precioTotalConDescuento = precioTotal - (precioTotal * descuento / 100);
  precioActualizadoElement.textContent = `$${precioTotalConDescuento.toFixed(2)}`;
  alert(`Precio total con descuento: $${precioTotalConDescuento.toFixed(2)}`);
});

salirBtn.addEventListener("click", () => {
  alert("Gracias por utilizar nuestro servicio. ¡Hasta luego!");
});

function actualizarPrecioTotal() {
  const precioTotal = mostrarCarrito(carritoProductos);
  precioActualizadoElement.textContent = `$${precioTotal.toFixed(2)}`;
}
