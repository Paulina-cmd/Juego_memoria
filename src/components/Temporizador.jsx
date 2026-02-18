// src/components/Temporizador.jsx
import React from 'react'

const Temporizador = ({ tiempo, movimientos }) => {
  const styles = {
    container: {
      display: 'flex',
      gap: '20px',
      background: 'rgba(255,255,255,0.1)',
      padding: '10px 20px',
      borderRadius: '30px',
      border: '1px solid rgba(255,255,255,0.2)'
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: 'white',
      fontSize: '1.2rem'
    },
    valor: {
      fontWeight: 'bold',
      color: '#FFD700',
      fontSize: '1.5rem',
      minWidth: '50px',
      textAlign: 'center'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.item}>
        <span style={{ fontSize: '1.5rem' }}>⏱️</span>
        <span style={styles.valor}>{tiempo}</span>
      </div>
      <div style={styles.item}>
        <span style={{ fontSize: '1.5rem' }}>🔄</span>
        <span style={styles.valor}>{movimientos}</span>
      </div>
    </div>
  )
}

export default Temporizador