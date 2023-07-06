/* precios de los servicios */
const servicios = {
    botox: 100,
    acido: 200,
    vitaminaC: 300
  };
  
/* Función para calcular el precio con descuento */
  function calcularPrecioConDescuento(precio, descuento) {
    const porcentajeDescuento = descuento / 100;
    const montoDescuento = precio * porcentajeDescuento;
    const precioConDescuento = precio - montoDescuento;
    return precioConDescuento;
  }
  
/*   Obtener el servicio seleccionado y el descuento del usuario */
  const servicioSeleccionado = prompt("Ingrese el servicio seleccionado (botox, acido o vitaminaC):");
  const descuento = parseFloat(prompt("Ingrese el porcentaje de descuento:"));
  
/* Obtener el precio del servicio seleccionado */
  const precioServicio = servicios[servicioSeleccionado];
  
/* Verificar si el servicio existe en el objeto de precios */
  if (precioServicio !== undefined) {

/* Calcular el precio con descuento */
    const precioConDescuento = calcularPrecioConDescuento(precioServicio, descuento);
  
/* Mostrar el resultado */
    console.log("El precio del servicio seleccionado con descuento es: $" + precioConDescuento.toFixed(2));
  } else {
    console.log("El servicio seleccionado no es válido.");
  }