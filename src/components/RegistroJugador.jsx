// src/components/RegistroJugador.jsx
import React, { useState } from 'react'

const RegistroJugador = ({ onRegistrar }) => {
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState('')

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    },
    card: {
      background: 'white',
      padding: '40px',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      maxWidth: '400px',
      width: '90%',
      textAlign: 'center'
    },
    titulo: {
      color: '#333',
      fontSize: '2rem',
      marginBottom: '10px'
    },
    subtitulo: {
      color: '#666',
      marginBottom: '30px'
    },
    input: {
      width: '100%',
      padding: '15px',
      fontSize: '1.1rem',
      border: '2px solid #e0e0e0',
      borderRadius: '10px',
      marginBottom: '10px',
      transition: 'border 0.3s',
      outline: 'none',
      boxSizing: 'border-box'
    },
    inputFocus: {
      border: '2px solid #667eea'
    },
    error: {
      color: '#e74c3c',
      fontSize: '0.9rem',
      marginBottom: '15px',
      textAlign: 'left'
    },
    instrucciones: {
      background: '#f8f9fa',
      padding: '20px',
      borderRadius: '10px',
      margin: '20px 0',
      textAlign: 'left'
    },
    instruccion: {
      margin: '10px 0',
      color: '#555',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    boton: {
      width: '100%',
      padding: '15px',
      fontSize: '1.2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'transform 0.2s, box-shadow 0.2s'
    },
    botonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 20px rgba(102,126,234,0.4)'
    }
  }

  const [inputFocus, setInputFocus] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (nombre.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres')
      return
    }
    onRegistrar(nombre.trim())
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <h1 style={styles.titulo}>🎮 Pokémon Memory</h1>
        <p style={styles.subtitulo}>¡Hola! ¿Cómo te llamas?</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onFocus={() => setInputFocus(true)}
            onBlur={() => setInputFocus(false)}
            maxLength={20}
            style={{
              ...styles.input,
              ...(inputFocus ? styles.inputFocus : {})
            }}
            autoFocus
          />
          {error && <div style={styles.error}>{error}</div>}
          
          <div style={styles.instrucciones}>
            <div style={styles.instruccion}>
              <span>⏱️</span> Encuentra los pares lo más rápido posible
            </div>
            <div style={styles.instruccion}>
              <span>🔄</span> Menos movimientos = mejor puntuación
            </div>
            <div style={styles.instruccion}>
              <span>🏆</span> Los mejores 10 van al leaderboard
            </div>
            <div style={styles.instruccion}>
              <span>👀</span> Memoriza las cartas al inicio
            </div>
          </div>
          
          <button 
            type="submit" 
            style={styles.boton}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(102,126,234,0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            ¡Comenzar Aventura! 🚀
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegistroJugador