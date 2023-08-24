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
const precioActualizado = document.getElementById("precioActualizado");

const cargarCarrito = () => {
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    carritoProductos.push(...JSON.parse(carritoGuardado));
  }
};

const guardarCarritoEnLocalStorage = () => {
  localStorage.setItem("carrito", JSON.stringify(carritoProductos));
};

const actualizarCarritoHTML = () => {
  carritoHTML.innerHTML = carritoProductos.map((producto) => `<li>${producto.cantidad}x ${producto.servicio}: ${servicios[producto.servicio]?.descripcion}</li>`).join('');
};

const actualizarPrecioTotal = () => {
  const precioTotal = carritoProductos.reduce((total, producto) => total + (servicios[producto.servicio]?.precio || 0) * producto.cantidad, 0);
  precioActualizado.textContent = `$${precioTotal.toFixed(2)}`;
};

window.addEventListener("load", () => {
  cargarCarrito();
  actualizarCarritoHTML();
  actualizarPrecioTotal();
});

document.querySelectorAll(".agregar-producto").forEach((boton) => {
  boton.addEventListener("click", async () => {
    const servicioAgregar = boton.getAttribute("data-servicio");
    
    const { value: cantidadAgregar } = await Swal.fire({
      title: `Cuantos prodcutos desea agregar?`,
      icon: 'question',
      input: 'range',
      inputLabel: `Cantidad de ${servicioAgregar} a agregar`,
      inputAttributes: {
        min: 1,
        max: 1000,
        step: 1
      },
      inputValue: 1
    });

    if (cantidadAgregar) {
      if (cantidadAgregar > 0) {
        const productoExistente = carritoProductos.find((producto) => producto.servicio === servicioAgregar);
        if (productoExistente) {
          productoExistente.cantidad += cantidadAgregar;
        } else {
          carritoProductos.push({ servicio: servicioAgregar, cantidad: cantidadAgregar });
        }
        
        guardarCarritoEnLocalStorage();
        actualizarCarritoHTML();
        actualizarPrecioTotal();
        Swal.fire(`Se han agregado ${cantidadAgregar} ${servicioAgregar} al carrito.`);
      }
    }
  });
});

document.getElementById("eliminarBtn").addEventListener("click", async () => {
  const { value: servicioEliminar } = await Swal.fire({
    title: 'Seleccionar producto a eliminar',
    input: 'select',
    inputOptions: {
      'Productos': {
        botox: 'Botox',
        acido: 'Ácido Hialurónico',
        vitaminaC: 'Vitamina C',
        limpiezaFacial: 'Limpieza Facial',
        microdermoabrasion: 'Microdermoabrasión',
        masajeRelajante: 'Masaje Relajante',
        pedicuraSpa: 'Pedicura Spa',
        tratamientoCapilar: 'Tratamiento Capilar'
      }
    },
    inputPlaceholder: 'Selecciona un producto',
    showCancelButton: true,
    inputValidator: (value) => {
      return new Promise((resolve) => {
        if (value) {
          resolve();
        } else {
          resolve('Debes seleccionar un producto');
        }
      });
    }
  });
  if (servicioEliminar) {
    const { value: cantidadEliminar } = await Swal.fire({
      title: 'Seleccionar cantidad a eliminar',
      icon: 'question',
      input: 'range',
      inputLabel: 'Cantidad a eliminar',
      inputAttributes: {
        min: 1,
        max: 1000,
        step: 1
      },
      inputValue: 1
    });
    if (cantidadEliminar) {
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
        Swal.fire(`Se han eliminado ${cantidadEliminar}x ${servicioEliminar} del carrito.`);
      } else {
        Swal.fire("El producto no está en el carrito.");
      }
    } else {
      Swal.fire("Por favor, ingresa una cantidad válida.");
    }
  }
});


document.getElementById("limpiarBtn").addEventListener("click", () => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })
  
  swalWithBootstrapButtons.fire({
    title: '¿Esta seguro?',
    text: "¡No podras recuperar tu carrito!",
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText: 'No, cancelar!',
    confirmButtonText: 'Si, eliminar carrito',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      carritoProductos.length = 0;
      guardarCarritoEnLocalStorage();
      actualizarCarritoHTML();
      actualizarPrecioTotal();
  }})
});

document.getElementById("descuentoBtn").addEventListener("click", () => {
  const descuento = parseFloat(prompt("Ingrese el descuento (por ejemplo, 15 para un 15% de descuento):") || 0);
  const precioTotal = carritoProductos.reduce((total, producto) => total + (servicios[producto.servicio]?.precio || 0) * producto.cantidad, 0);
  const precioTotalConDescuento = precioTotal - (precioTotal * descuento / 100);
  precioActualizado.textContent = `$${precioTotalConDescuento.toFixed(2)}`;
  alert(`Precio total con descuento: $${precioTotalConDescuento.toFixed(2)}`);
});

