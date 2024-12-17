import React, { useState, useEffect } from 'react';

function App() {
  const [pokemons, setPokemons] = useState([]);
  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=50')
      .then(response => response.json())
      .then(data => {
        const pokemonDetailsPromises = data.results.map(pokemon =>
          fetch(pokemon.url).then(res => res.json())
        );
        Promise.all(pokemonDetailsPromises)
          .then(details => setPokemons(details));
      })
      .catch(error => console.error('Error fetching Pokémon:', error));
  }, []);

  const toggleDetails = (pokemonName) => {
    setPokemons(pokemons.map(pokemon =>
      pokemon.name === pokemonName ? { ...pokemon, showDetails: !pokemon.showDetails } : pokemon
    ));
  };

  return (
    <div style ={{ textAlign: 'center'}}>
      <h1>Pokémon List</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {pokemons.map(pokemon => (
          <div key={pokemon.name} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', width: '150px', textAlign: 'center' }}>
            <h2
              style={{ cursor: 'pointer', color: '#3d7dca' }} onClick={() => toggleDetails(pokemon.name)}>
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </h2>

            {pokemon.showDetails && (
              <div>
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                  alt={pokemon.name}
                  style={{ width: '70px', height: '70px' }}
                />
                <p><strong>Types:</strong> {pokemon.types.map(type => type.type.name).join(', ')}</p>
                <p><strong>Abilities:</strong> {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
                <p><strong>Stats:</strong></p>
                <ul>
                  {pokemon.stats.map(stat => (
                    <li key={stat.stat.name}>{stat.stat.name}: {stat.base_stat}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;