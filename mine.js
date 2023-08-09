const servicios = {
  botox: { precio: 100, descripcion: "Tratamiento de botox para rejuvenecer la piel." },
  acido: { precio: 200, descripcion: "Tratamiento con ácido hialurónico para hidratar la piel." },
  vitaminaC: { precio: 300, descripcion: "Tratamiento con vitamina C para mejorar la luminosidad de la piel." },
  limpiezaFacial: { precio: 80, descripcion: "Tratamiento de limpieza facial para revitalizar la piel." },
  microdermoabrasion: { precio: 150, descripcion: "Tratamiento de microdermoabrasión para exfoliar y renovar la piel." },
  masajeRelajante: { precio: 120, descripcion: "Tratamiento de masaje relajante para aliviar tensiones y estrés." },
  pedicuraSpa: { precio: 90, descripcion: "Tratamiento de pedicura spa para el cuidado y belleza de tus pies." },
  tratamientoCapilar: { precio: 180, descripcion: "Tratamiento capilar para fortalecer y mejorar la salud del cabello." },
};

const carritoProductos = [];
const carritoHTML = document.getElementById("carrito");
const precioActualizadoElement = document.getElementById("precioActualizado");

const cargarCarritoDesdeLocalStorage = () => {
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    carritoProductos.push(...JSON.parse(carritoGuardado));
  }
};

const guardarCarritoEnLocalStorage = () => {
  localStorage.setItem("carrito", JSON.stringify(carritoProductos));
};

const actualizarCarritoHTML = () => {
  carritoHTML.innerHTML = carritoProductos.map(producto => `<li>${producto.cantidad}x ${producto.servicio}: ${servicios[producto.servicio]?.descripcion}</li>`).join('');
};

const actualizarPrecioTotal = () => {
  const precioTotal = carritoProductos.reduce((total, producto) => total + (servicios[producto.servicio]?.precio || 0) * producto.cantidad, 0);
  precioActualizadoElement.textContent = `$${precioTotal.toFixed(2)}`;
};

window.addEventListener("load", () => {
  cargarCarritoDesdeLocalStorage();
  actualizarCarritoHTML();
  actualizarPrecioTotal();
});

document.querySelectorAll(".agregar-producto").forEach(boton => {
  boton.addEventListener("click", () => {
    const servicioAgregar = boton.getAttribute("data-servicio");
    const cantidadAgregar = parseInt(prompt(`Ingrese la cantidad de ${servicioAgregar} a agregar:`)) || 0;

    if (cantidadAgregar > 0) {
      const productoExistente = carritoProductos.find(producto => producto.servicio === servicioAgregar);
      if (productoExistente) {
        productoExistente.cantidad += cantidadAgregar;
      } else {
        carritoProductos.push({ servicio: servicioAgregar, cantidad: cantidadAgregar });
      }
      
      guardarCarritoEnLocalStorage();
      actualizarCarritoHTML();
      actualizarPrecioTotal();
      alert(`Se han agregado ${cantidadAgregar}x ${servicioAgregar} al carrito.`);
    } else {
      alert("Por favor, ingresa una cantidad válida.");
    }
  });
});

document.getElementById("eliminarBtn").addEventListener("click", () => {
  const servicioEliminar = prompt("Ingrese el servicio a eliminar: (botox, acido, vitaminaC, limpiezaFacial, microdermoabrasion, masajeRelajante, pedicuraSpa, tratamientoCapilar)").toLowerCase();
  const cantidadEliminar = parseInt(prompt("Ingrese la cantidad a eliminar:") || 0);
  if (cantidadEliminar > 0) {
    const productoExistente = carritoProductos.find(producto => producto.servicio === servicioEliminar);
    if (productoExistente) {
      productoExistente.cantidad -= cantidadEliminar;
      if (productoExistente.cantidad <= 0) {
        const index = carritoProductos.indexOf(productoExistente);
        if (index !== -1) {
          carritoProductos.splice(index, 1);
        }
      }
      guardarCarritoEnLocalStorage();
      actualizarCarritoHTML();
      actualizarPrecioTotal();
      alert(`Se han eliminado ${cantidadEliminar}x ${servicioEliminar} del carrito.`);
    } else {
      alert("El producto no está en el carrito.");
    }
  } else {
    alert("Por favor, ingresa una cantidad válida.");
  }
});

document.getElementById("limpiarBtn").addEventListener("click", () => {
  const confirmacion = confirm("¿Estás seguro de que deseas limpiar el carrito?");
  if (confirmacion) {
    carritoProductos.length = 0;
    guardarCarritoEnLocalStorage();
    actualizarCarritoHTML();
    actualizarPrecioTotal();
    alert("El carrito se ha limpiado.");
  }
});

document.getElementById("descuentoBtn").addEventListener("click", () => {
  const descuento = parseFloat(prompt("Ingrese el descuento (por ejemplo, 15 para un 15% de descuento):") || 0);
  const precioTotal = carritoProductos.reduce((total, producto) => total + (servicios[producto.servicio]?.precio || 0) * producto.cantidad, 0);
  const precioTotalConDescuento = precioTotal - (precioTotal * descuento / 100);
  precioActualizadoElement.textContent = `$${precioTotalConDescuento.toFixed(2)}`;
  alert(`Precio total con descuento: $${precioTotalConDescuento.toFixed(2)}`);
});

