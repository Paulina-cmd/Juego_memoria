import React, { useEffect } from 'react'

const Cargando = () => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a2634, #2C3E50)'
    },
    pokeball: {
      width: '80px',
      height: '80px',
      background: 'white',
      borderRadius: '50%',
      position: 'relative',
      marginBottom: '20px',
      border: '4px solid #333',
      animation: 'bounce 1s ease-in-out infinite'
    },
    texto: {
      color: 'white',
      fontSize: '1.2rem',
      marginTop: '20px'
    }
  }

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
      .pokeball-top {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 50%;
        background: #ff0000;
        border-radius: 80px 80px 0 0;
      }
      .pokeball-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50%;
        background: white;
        border-radius: 0 0 80px 80px;
      }
      .pokeball-middle {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        background: white;
        border-radius: 50%;
        border: 3px solid #333;
        z-index: 2;
      }
    `
    document.head.appendChild(style)
    return () => style.remove()
  }, [])

  return (
    <div style={styles.container}>
      <div style={styles.pokeball} className="pokeball-anim">
        <div className="pokeball-top"></div>
        <div className="pokeball-middle"></div>
        <div className="pokeball-bottom"></div>
      </div>
      <p style={styles.texto}>Cargando Pokémon...</p>
    </div>
  )
}

export default Cargando
