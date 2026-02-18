import { useState, useEffect, useRef } from 'react'

export const useTemporizador = (inicia = false) => {
  const [tiempo, setTiempo] = useState(0)
  const [activo, setActivo] = useState(inicia)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (activo) {
      intervalRef.current = setInterval(() => {
        setTiempo(t => t + 1)
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [activo])

  const iniciar = () => setActivo(true)
  const pausar = () => setActivo(false)
  const reiniciar = () => {
    setTiempo(0)
    setActivo(false)
  }

  const formatoTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60)
    const secs = segundos % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return {
    tiempo,
    tiempoFormato: formatoTiempo(tiempo),
    activo,
    iniciar,
    pausar,
    reiniciar
  }
}
