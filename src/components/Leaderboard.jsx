// src/components/Leaderboard.jsx
import React from 'react'

const Leaderboard = ({ puntuaciones, onCerrar }) => {
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    },
    modal: {
      background: 'white',
      padding: '30px',
      borderRadius: '20px',
      maxWidth: '600px',
      width: '90%',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    },
    titulo: {
      textAlign: 'center',
      marginBottom: '30px',
      fontSize: '2rem',
      color: '#333'
    },
    tabla: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '30px'
    },
    th: {
      padding: '12px',
      background: '#f8f9fa',
      color: '#333',
      fontWeight: 'bold',
      borderBottom: '2px solid #667eea'
    },
    td: {
      padding: '10px',
      textAlign: 'center',
      borderBottom: '1px solid #e0e0e0'
    },
    filaTop: {
      background: 'rgba(255,215,0,0.1)'
    },
    boton: {
      display: 'block',
      width: '200px',
      margin: '0 auto',
      padding: '12px 30px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '1rem',
      transition: 'transform 0.2s'
    }
  }

  const getMedalla = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return '🎮'
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.titulo}>🏆 Mejores Puntuaciones</h2>
        
        {puntuaciones.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            Aún no hay puntuaciones. ¡Sé el primero!
          </p>
        ) : (
          <table style={styles.tabla}>
            <thead>
              <tr>
                <th style={styles.th}>Pos</th>
                <th style={styles.th}>Jugador</th>
                <th style={styles.th}>Mov</th>
                <th style={styles.th}>Tiempo</th>
                <th style={styles.th}>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {puntuaciones.map((p, index) => (
                <tr key={p.id} style={index < 3 ? styles.filaTop : {}}>
                  <td style={styles.td}>{getMedalla(index)}</td>
                  <td style={styles.td}>{p.nombre}</td>
                  <td style={styles.td}>{p.movimientos}</td>
                  <td style={styles.td}>{p.tiempo}</td>
                  <td style={{...styles.td, fontWeight: 'bold', color: '#667eea'}}>
                    {p.puntuacion}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        <button 
          style={styles.boton}
          onClick={onCerrar}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}

export default Leaderboard