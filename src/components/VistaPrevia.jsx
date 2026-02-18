// src/components/VistaPrevia.jsx
import React, { useState, useEffect } from 'react'

const VistaPrevia = ({ cartas, onCompletada }) => {
  const [segundos, setSegundos] = useState(3)

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    container: {
      textAlign: 'center',
      color: 'white',
      maxWidth: '900px',
      width: '95%'
    },
    titulo: {
      fontSize: '2.5rem',
      marginBottom: '20px',
      color: '#FFD700',
      textShadow: '0 0 10px rgba(255,215,0,0.5)'
    },
    contador: {
      fontSize: '6rem',
      fontWeight: 'bold',
      color: '#FF6B6B',
      marginBottom: '30px',
      animation: 'pulse 1s infinite'
    },
    tablero: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)', // ¡6 columnas!
      gap: '10px',
      maxWidth: '800px',
      margin: '0 auto 30px'
    },
    carta: {
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '10px',
      padding: '10px',
      animation: 'slideIn 0.3s ease-out',
      border: '2px solid rgba(255,215,0,0.3)'
    },
    imagen: {
      width: '70px',
      height: '70px',
      objectFit: 'contain',
      marginBottom: '5px'
    },
    nombre: {
      fontSize: '12px',
      color: '#FFD700',
      textTransform: 'capitalize',
      display: 'block'
    },
    mensaje: {
      fontSize: '1.2rem',
      opacity: 0.8,
      marginTop: '20px'
    }
  }

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
      }
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `
    document.head.appendChild(style)
    return () => style.remove()
  }, [])

  useEffect(() => {
    if (segundos > 0) {
      const timer = setTimeout(() => setSegundos(segundos - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      onCompletada()
    }
  }, [segundos, onCompletada])

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <h2 style={styles.titulo}>¡Memoriza los Pokémon!</h2>
        <div style={styles.contador}>{segundos}</div>
        
        <div style={styles.tablero}>
          {cartas.map((carta, index) => (
            <div key={index} style={styles.carta}>
              <img src={carta.imagen} alt={carta.nombre} style={styles.imagen} />
              <span style={styles.nombre}>{carta.nombre}</span>
            </div>
          ))}
        </div>
        
        <p style={styles.mensaje}>
          {segundos === 3 && "⚡ Prepárate..."}
          {segundos === 2 && "👀 Observa bien..."}
          {segundos === 1 && "🎯 ¡Concéntrate!"}
        </p>
      </div>
    </div>
  )
}

export default VistaPrevia