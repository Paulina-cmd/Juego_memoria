export const obtenerPokemons = async (limite = 6) => {
  try {
    
    const ids = []
    for (let i = 0; i < limite; i++) {
      ids.push(Math.floor(Math.random() * 150) + 1)
    }
    
    const pokemons = await Promise.all(
      ids.map(async (id) => {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        const data = await respuesta.json()
        return {
          id: data.id,
          nombre: data.name,
          imagen: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
          tipo: data.types[0].type.name
        }
      })
    )
    
    return pokemons
  } catch (error) {
    console.error('Error cargando pokemons:', error)
    return [
      { id: 25, nombre: 'pikachu', imagen: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png', tipo: 'electric' },
      { id: 1, nombre: 'bulbasaur', imagen: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png', tipo: 'grass' },
      { id: 4, nombre: 'charmander', imagen: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png', tipo: 'fire' },
      { id: 7, nombre: 'squirtle', imagen: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png', tipo: 'water' },
      { id: 133, nombre: 'eevee', imagen: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png', tipo: 'normal' },
      { id: 143, nombre: 'snorlax', imagen: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png', tipo: 'normal' }
    ]
  }
}
