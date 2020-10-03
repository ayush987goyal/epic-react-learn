// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null,
  })

  React.useEffect(() => {
    if (!pokemonName) return
    ;(async () => {
      setState({status: 'pending', pokemon: null, error: null})
      try {
        const data = await fetchPokemon(pokemonName)
        setState({status: 'resolved', pokemon: data, error: null})
      } catch (err) {
        setState({status: 'rejected', pokemon: null, error: err})
      }
    })()
  }, [pokemonName])

  if (state.status === 'idle') return 'Submit a pokemon'
  if (state.status === 'pending')
    return <PokemonInfoFallback name={pokemonName} />
  if (state.status === 'rejected') throw state.error

  return <PokemonDataView pokemon={state.pokemon} />
}

function ErrorFallback({error}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          resetKeys={[pokemonName]}
          onReset={() => setPokemonName('')}
          FallbackComponent={ErrorFallback}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
