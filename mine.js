const servicios = {};

const productos = [];
const carritoHTML = document.getElementById("carrito");
const precioActualizado = document.getElementById("precioActualizado");

const cargarCarrito = () => {
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    productos.push(...JSON.parse(carritoGuardado));
  }
};

const guardarCarritoEnLocalStorage = () => {
  localStorage.setItem("carrito", JSON.stringify(productos));
};

const actualizarCarritoHTML = () => {
  carritoHTML.innerHTML = productos.map((producto) => `<li>${producto.cantidad}- ${producto.servicio}: ${servicios[producto.servicio]?.descripcion}</li>`).join('');
};

const actualizarPrecioTotal = () => {
  const precioTotal = productos.reduce((total, producto) => total + (servicios[producto.servicio]?.precio || 0) * producto.cantidad, 0);
  precioActualizado.textContent = `$${precioTotal.toFixed(2)}`;
};

const cargarServiciosDesdeJSON = async () => {
  try {
    const response = await fetch('servicios.json');
    const data = await response.json();
    Object.assign(servicios, data);
  } catch (error) {
    console.error('Error al cargar los servicios desde JSON:', error);
  }
};

window.addEventListener("load", async () => {
  await cargarServiciosDesdeJSON();
  cargarCarrito();
  actualizarCarritoHTML();
  actualizarPrecioTotal();
});


document.querySelectorAll(".agregar-producto").forEach((boton) => {
  boton.addEventListener("click", async () => {
    const agregarServicio = boton.getAttribute("data-servicio");
    
    const { value: cantidadAgregar } = await Swal.fire({
      title: `Cuantos productos desea agregar?`,
      icon: 'question',
      input: 'range',
      inputLabel: `Cantidad de ${agregarServicio} a agregar`,
      inputAttributes: {
        min: 1,
        max: 1000,
        step: 1
      },
      inputValue: 1
    });

    if (cantidadAgregar) {
      if (cantidadAgregar > 0) {
        const productoExistente = productos.find((producto) => producto.servicio === agregarServicio);
        if (productoExistente) {
          productoExistente.cantidad += cantidadAgregar;
        } else {
          productos.push({ servicio: agregarServicio, cantidad: cantidadAgregar });
        }
        
        guardarCarritoEnLocalStorage();
        actualizarCarritoHTML();
        actualizarPrecioTotal();
        Swal.fire(`Se han agregado ${cantidadAgregar} ${agregarServicio} al carrito.`);
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
    const { value: eliminarProducto } = await Swal.fire({
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
    if (eliminarProducto) {
      const productoExistente = productos.find(producto => producto.servicio === servicioEliminar);
      if (productoExistente) {
        productoExistente.cantidad -= eliminarProducto;
        if (productoExistente.cantidad <= 0) {
          const index = productos.indexOf(productoExistente);
          if (index !== -1) {
            productos.splice(index, 1);
          }
        }
        guardarCarritoEnLocalStorage();
        actualizarCarritoHTML();
        actualizarPrecioTotal();
        Swal.fire(`Se han eliminado ${eliminarProducto} ${servicioEliminar} del carrito.`);
      } else {
        Swal.fire("El producto no está en el carrito.");
      }
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
    title: '¿Está seguro?',
    text: "Perderás todos los productos seleccionados.",
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText: 'No, cancelar!',
    confirmButtonText: 'Si, eliminar carrito',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      productos.length = 0;
      guardarCarritoEnLocalStorage();
      actualizarCarritoHTML();
      actualizarPrecioTotal();
    }
  })
});
