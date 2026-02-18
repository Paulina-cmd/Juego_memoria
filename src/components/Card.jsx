import React from 'react'

const Card = ({ pokemon, seleccionada, emparejada, onClick }) => {
  const styles = {
    
  card: {
    width: '130px', 
    height: '160px', 
    cursor: 'pointer',
    perspective: '1000px',
    margin: '5px',
    transition: 'transform 0.2s',
    opacity: emparejada ? 0 : 1,
    pointerEvents: emparejada ? 'none' : 'auto'
  },
    cardInner: {
      position: 'relative',
      width: '100%',
      height: '100%',
      transition: 'transform 0.6s',
      transformStyle: 'preserve-3d',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      transform: seleccionada ? 'rotateY(180deg)' : 'none'
    },
    cardFront: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
      borderRadius: '10px',
      background: 'linear-gradient(135deg, #f5f5f5, #ffffff)',
      transform: 'rotateY(180deg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px',
      border: '3px solid #ffcb05'
    },
    cardBack: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
      borderRadius: '10px',
      background: 'linear-gradient(135deg, #ff0000, #cc0000)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    },
    pokeball: {
      width: '50px',
      height: '50px',
      background: 'white',
      borderRadius: '50%',
      position: 'relative',
      marginBottom: '10px',
      border: '3px solid #333'
    },
  imagen: {
    width: '70px', 
    height: '70px', 
    objectFit: 'contain'
  },
    nombre: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#2a75bb',
      textTransform: 'capitalize',
      marginTop: '5px'
    }
  }

  if (emparejada) {
    return <div style={styles.card}></div>
  }

  return (
    <div 
      style={styles.card}
      onClick={onClick}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={styles.cardInner}>
        <div style={styles.cardFront}>
          <img 
            src={pokemon?.imagen} 
            alt={pokemon?.nombre}
            style={styles.imagen}
            onError={(e) => {
              e.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
            }}
          />
          <span style={styles.nombre}>{pokemon?.nombre}</span>
        </div>
        
        <div style={styles.cardBack}>
          <div style={styles.pokeball}></div>
          <span>¿Quién es?</span>
        </div>
      </div>
    </div>
  )
}

export default Card
