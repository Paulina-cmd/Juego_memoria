// src/App.jsx
import React, { useState, useEffect } from 'react'
import Card from './components/Card'
import Temporizador from './components/Temporizador'
import Leaderboard from './components/Leaderboard'
import RegistroJugador from './components/RegistroJugador'
import VistaPrevia from './components/VistaPrevia'
import Cargando from './components/Cargando'
import { obtenerPokemons } from './services/pokeApi'
import { useTemporizador } from './hooks/useTemporizador'
import { guardarPuntuacion, obtenerPuntuaciones } from './utils/leaderboard'

function App() {
  const [jugador, setJugador] = useState(null)
  const [cartas, setCartas] = useState([])
  const [cartasOriginales, setCartasOriginales] = useState([])
  const [cargando, setCargando] = useState(false)
  const [cartasSeleccionadas, setCartasSeleccionadas] = useState([])
  const [paresEncontrados, setParesEncontrados] = useState([])
  const [movimientos, setMovimientos] = useState(0)
  const [bloquear, setBloquear] = useState(false)
  const [juegoIniciado, setJuegoIniciado] = useState(false)
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false)
  const [mostrarLeaderboard, setMostrarLeaderboard] = useState(false)
  const [mostrarVictoria, setMostrarVictoria] = useState(false)
  const [puntuaciones, setPuntuaciones] = useState([])
  
  const { tiempo, tiempoFormato, iniciar, pausar, reiniciar } = useTemporizador()

  useEffect(() => {
    setPuntuaciones(obtenerPuntuaciones())
  }, [])

  // ===== ESTILOS RESPONSIVE CON CSS =====
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      /* Estilos para el tablero responsive */
      .tablero-grid {
        display: grid;
        gap: 15px;
        max-width: 1000px;
        margin: 0 auto;
        justify-items: center;
        padding: 20px;
        grid-template-columns: repeat(6, 1fr);
      }
      
      @media (max-width: 768px) {
        .tablero-grid {
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
      }
      
      @media (max-width: 480px) {
        .tablero-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          padding: 10px;
        }
      }

      /* Animaciones */
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translate(-50%, -30%);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%);
        }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    `
    document.head.appendChild(style)
    return () => style.remove()
  }, [])

  const inicializarJuego = async (nombreJugador) => {
    setJugador(nombreJugador)
    setCargando(true)
    
    const pokemons = await obtenerPokemons(6)
    setCartasOriginales(pokemons)
    
    // Crear baraja SIN mezclar para la vista previa
    const baraja = [...pokemons, ...pokemons]
      .map((item, index) => ({
        ...item,
        cartaId: index,
        volteada: true, // Todas visibles para la vista previa
        emparejada: false
      }))
    
    setCartas(baraja)
    setCartasSeleccionadas([])
    setParesEncontrados([])
    setMovimientos(0)
    setCargando(false)
    setJuegoIniciado(false)
    setMostrarVistaPrevia(true)
  }

  const terminarVistaPrevia = () => {
    setMostrarVistaPrevia(false)
    
    // AHORA SÍ: Mezclar las cartas después de la vista previa
    const cartasMezcladas = [...cartas]
      .sort(() => Math.random() - 0.5)
      .map(c => ({ ...c, volteada: false })) // Y las volteamos
    
    setCartas(cartasMezcladas)
    setJuegoIniciado(true)
    iniciar()
  }

  const manejarClick = (cartaId) => {
    if (bloquear || !juegoIniciado) return
    
    const carta = cartas.find(c => c.cartaId === cartaId)
    
    if (carta.emparejada || cartasSeleccionadas.includes(cartaId) || carta.volteada) {
      return
    }

    if (cartasSeleccionadas.length === 2) return

    // Voltear carta
    setCartas(cartas.map(c => 
      c.cartaId === cartaId ? { ...c, volteada: true } : c
    ))
    
    setCartasSeleccionadas([...cartasSeleccionadas, cartaId])
    setMovimientos(movimientos + 1)

    // Verificar par
    if (cartasSeleccionadas.length === 1) {
      const primeraCarta = cartas.find(c => c.cartaId === cartasSeleccionadas[0])
      const segundaCarta = carta

      if (primeraCarta.id === segundaCarta.id) {
        // Son iguales
        setTimeout(() => {
          setCartas(cartas.map(c => 
            c.id === primeraCarta.id ? { ...c, emparejada: true } : c
          ))
          setParesEncontrados([...paresEncontrados, primeraCarta.id])
          setCartasSeleccionadas([])
        }, 500)
      } else {
        // No son iguales
        setBloquear(true)
        setTimeout(() => {
          setCartas(cartas.map(c => 
            cartasSeleccionadas.includes(c.cartaId) || c.cartaId === cartaId
              ? { ...c, volteada: false }
              : c
          ))
          setCartasSeleccionadas([])
          setBloquear(false)
        }, 1000)
      }
    }
  }

  // Verificar victoria
  useEffect(() => {
    if (paresEncontrados.length === 6 && juegoIniciado) {
      pausar()
      setJuegoIniciado(false)
      setMostrarVictoria(true)
      
      const nuevasPuntuaciones = guardarPuntuacion(jugador, movimientos, tiempo)
      setPuntuaciones(nuevasPuntuaciones)
    }
  }, [paresEncontrados, juegoIniciado, jugador, movimientos, tiempo, pausar])

  // ===== REINICIAR PARTIDA (MANTIENE EL MISMO JUGADOR) =====
  const reiniciarPartida = () => {
    // Guardamos el nombre del jugador actual
    const nombreActual = jugador
    
    // Reseteamos todo
    setMostrarVictoria(false)
    setJuegoIniciado(false)
    reiniciar() // Reinicia el temporizador
    setCartas([])
    setCartasSeleccionadas([])
    setParesEncontrados([])
    setMovimientos(0)
    setBloquear(false)
    setMostrarVistaPrevia(false)
    
    // Iniciamos nueva partida con el MISMO jugador
    setCargando(true)
    setTimeout(() => {
      inicializarJuego(nombreActual)
    }, 100)
  }

  const nuevoJuego = () => {
    setJugador(null)
    setJuegoIniciado(false)
    setMostrarVictoria(false)
    reiniciar()
    setCartas([])
  }

  // Componente de mensaje de victoria
  const MensajeVictoria = () => (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      padding: '40px',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      textAlign: 'center',
      zIndex: 2000,
      animation: 'slideUp 0.5s ease-out',
      maxWidth: '400px',
      width: '90%'
    }}>
      <h2 style={{ fontSize: '4rem', marginBottom: '10px' }}>🎉</h2>
      <h3 style={{ fontSize: '2rem', color: '#333', marginBottom: '20px' }}>
        ¡Felicidades {jugador}!
      </h3>
      <div style={{ fontSize: '1.2rem', color: '#666', marginBottom: '15px' }}>
        ⏱️ Tiempo: {tiempoFormato}
      </div>
      <div style={{ fontSize: '1.2rem', color: '#666', marginBottom: '30px' }}>
        🔄 Movimientos: {movimientos}
      </div>
      <div style={{ 
        fontSize: '2rem', 
        color: '#667eea', 
        fontWeight: 'bold', 
        marginBottom: '30px',
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '10px'
      }}>
        {Math.max(0, 1000 - (movimientos * 10) - (tiempo * 2))} pts
      </div>
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => {
            setMostrarVictoria(false)
            setMostrarLeaderboard(true)
          }}
          style={{
            padding: '12px 25px',
            fontSize: '1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Ver Leaderboard 🏆
        </button>
        
        {/* Botón REINTENTAR (mantiene nombre) */}
        <button
          onClick={() => {
            setMostrarVictoria(false)
            reiniciarPartida()
          }}
          style={{
            padding: '12px 25px',
            fontSize: '1rem',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Reintentar 🔄
        </button>
        
        {/* Botón CAMBIAR JUGADOR */}
        <button
          onClick={() => {
            setMostrarVictoria(false)
            nuevoJuego()
          }}
          style={{
            padding: '12px 25px',
            fontSize: '1rem',
            background: '#FF6B6B',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Cambiar Jugador 👤
        </button>
      </div>
    </div>
  )

  const styles = {
    app: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      maxWidth: '1000px',
      margin: '0 auto 30px',
      padding: '20px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '20px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)'
    },
    titulo: {
      color: 'white',
      textAlign: 'center',
      marginBottom: '20px',
      fontSize: '2.5rem',
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
    },
    headerInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px',
      marginBottom: '20px'
    },
    jugadorInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: 'rgba(255,255,255,0.15)',
      padding: '8px 20px',
      borderRadius: '30px',
      border: '1px solid rgba(255,255,255,0.3)'
    },
    nombreJugador: {
      color: '#FFD700',
      fontWeight: 'bold',
      fontSize: '1.2rem'
    },
    botones: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    boton: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '0.9rem',
      transition: 'all 0.2s',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    progreso: {
      position: 'relative',
      height: '25px',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '15px',
      overflow: 'hidden',
      marginTop: '15px',
      border: '1px solid rgba(255,255,255,0.3)'
    },
    barraProgreso: {
      height: '100%',
      background: 'linear-gradient(90deg, #FFD700, #FF6B6B)',
      transition: 'width 0.3s ease',
      borderRadius: '15px'
    },
    progresoTexto: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: 'white',
      fontSize: '14px',
      fontWeight: 'bold',
      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
    },
    juegoActivo: {
      textAlign: 'center',
      marginTop: '20px',
      color: 'white',
      fontSize: '1.2rem',
      animation: 'pulse 2s infinite'
    }
  }

  if (cargando) return <Cargando />
  if (!jugador) return <RegistroJugador onRegistrar={inicializarJuego} />

  return (
    <div style={styles.app}>
      {/* Vista previa */}
      {mostrarVistaPrevia && (
        <VistaPrevia 
          cartas={cartasOriginales} 
          onCompletada={terminarVistaPrevia} 
        />
      )}
      
      {/* Leaderboard */}
      {mostrarLeaderboard && (
        <Leaderboard 
          puntuaciones={puntuaciones}
          onCerrar={() => setMostrarLeaderboard(false)}
        />
      )}

      {/* Mensaje de victoria */}
      {mostrarVictoria && <MensajeVictoria />}

      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.titulo}>🎮 Pokémon Memory Game</h1>
        
        <div style={styles.headerInfo}>
          <div style={styles.jugadorInfo}>
            <span style={{ fontSize: '1.3rem' }}>👤</span>
            <span style={styles.nombreJugador}>{jugador}</span>
          </div>
          
          <Temporizador tiempo={tiempoFormato} movimientos={movimientos} />
          
          <div style={styles.botones}>
            {/* Botón Récords */}
            <button 
              onClick={() => setMostrarLeaderboard(true)}
              style={{
                ...styles.boton,
                background: '#FFD700',
                color: '#333'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              🏆 Récords
            </button>
            
            {/* NUEVO: Botón Reintentar (mantiene nombre) */}
            <button 
              onClick={reiniciarPartida}
              style={{
                ...styles.boton,
                background: '#4CAF50',
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              🔄 Reintentar
            </button>
            
            {/* Botón Cambiar Jugador */}
            <button 
              onClick={nuevoJuego}
              style={{
                ...styles.boton,
                background: '#FF6B6B',
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              👤 Cambiar Jugador
            </button>
          </div>
        </div>

        {/* Barra de progreso */}
        <div style={styles.progreso}>
          <div 
            style={{
              ...styles.barraProgreso,
              width: `${(paresEncontrados.length / 6) * 100}%`
            }}
          />
          <span style={styles.progresoTexto}>
            {paresEncontrados.length} / 6 pares
          </span>
        </div>
      </header>

      {/* Tablero de juego - CON CLASE tablero-grid */}
      <div className="tablero-grid">
        {cartas.map(carta => (
          <Card
            key={carta.cartaId}
            pokemon={carta}
            seleccionada={cartasSeleccionadas.includes(carta.cartaId)}
            emparejada={carta.emparejada}
            onClick={() => manejarClick(carta.cartaId)}
          />
        ))}
      </div>

      {/* Mensaje de juego en progreso */}
      {juegoIniciado && (
        <div style={styles.juegoActivo}>
          <p>✨ ¡Encuentra todos los pares! ✨</p>
        </div>
      )}
    </div>
  )
}

export default App