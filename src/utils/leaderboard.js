// src/utils/leaderboard.js
export const guardarPuntuacion = (nombre, movimientos, tiempo) => {
  const puntuaciones = obtenerPuntuaciones()
  
  // Calcular nueva puntuación
  const nuevaPuntuacion = {
    id: Date.now(),
    nombre: nombre || 'Jugador',
    movimientos,
    tiempo: `${Math.floor(tiempo / 60)}:${(tiempo % 60).toString().padStart(2, '0')}`,
    fecha: new Date().toLocaleDateString(),
    puntuacion: Math.max(0, 1000 - (movimientos * 10) - (tiempo * 2))
  }
  
  // Buscar si el jugador ya existe
  const existeJugador = puntuaciones.findIndex(p => p.nombre === nombre)
  
  if (existeJugador !== -1) {
    // Si ya existe, comparar puntuaciones
    if (nuevaPuntuacion.puntuacion > puntuaciones[existeJugador].puntuacion) {
      // Si la nueva es MEJOR, reemplazar
      puntuaciones[existeJugador] = nuevaPuntuacion
    } else {
      // Si no es mejor, devolvemos las puntuaciones sin cambios
      return puntuaciones
    }
  } else {
    // Si no existe, agregar nuevo
    puntuaciones.push(nuevaPuntuacion)
  }
  
  // Ordenar por puntuación (mejor primero)
  puntuaciones.sort((a, b) => b.puntuacion - a.puntuacion)
  
  // Guardar solo top 10
  localStorage.setItem('pokemon_leaderboard', JSON.stringify(puntuaciones.slice(0, 10)))
  return puntuaciones.slice(0, 10)
}

export const obtenerPuntuaciones = () => {
  const guardadas = localStorage.getItem('pokemon_leaderboard')
  return guardadas ? JSON.parse(guardadas) : []
}