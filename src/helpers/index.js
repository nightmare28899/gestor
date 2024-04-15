export const formatearCantidad = cantidad => {
  return Number(cantidad).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatearFecha = fecha => {
  const fechaNueva = new Date(fecha);
  const opciones = {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  };
  return fechaNueva.toLocaleDateString('es-ES', opciones);
};

export const generarId = () => {
  const random = Math.random().toString(36).substring(2, 11);
  const fecha = Date.now().toString(36);
  return random + fecha;
};

export const esNegativo = numero => {
  if (numero < 0) {
    return true; // El número es negativo
  } else {
    return false; // El número no es negativo
  }
};