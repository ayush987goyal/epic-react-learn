// Cache resources
// http://localhost:3000/isolated/exercise/04.js

import React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
} from '../pokemon'
import {createResource} from '../utils'

const PokemonResourceCacheContext = React.createContext()

function PokemonCacheProvider({cacheTime, children}) {
  const cache = React.useRef({})
  const expirations = React.useRef({})

  React.useEffect(() => {
    const interval = setInterval(() => {
      for (const [name, time] of Object.entries(expirations.current)) {
        if (time < Date.now()) {
          delete cache.current[name]
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getPokemonResource = React.useCallback(
    pokemonName => {
      const lowerName = pokemonName.toLowerCase()
      let resource = cache.current[lowerName]

      if (!resource) {
        resource = createPokemonResource(pokemonName)
        cache.current[lowerName] = resource
      }
      expirations.current[lowerName] = Date.now() + cacheTime

      return resource
    },
    [cacheTime],
  )

  return (
    <PokemonResourceCacheContext.Provider value={getPokemonResource}>
      {children}
    </PokemonResourceCacheContext.Provider>
  )
}

function usePokemonResourceCache() {
  const context = React.useContext(PokemonResourceCacheContext)
  if (!context) {
    throw new Error(
      `usePokemonResourceCache should be used within a PokemonCacheProvider`,
    )
  }
  return context
}

function PokemonInfo({pokemonResource}) {
  const pokemon = pokemonResource.read()
  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

const SUSPENSE_CONFIG = {
  timeoutMs: 4000,
  busyDelayMs: 300,
  busyMinDurationMs: 700,
}

function createPokemonResource(pokemonName) {
  return createResource(fetchPokemon(pokemonName))
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)
  const [pokemonResource, setPokemonResource] = React.useState(null)
  const getPokemonResource = usePokemonResourceCache()

  React.useEffect(() => {
    if (!pokemonName) {
      setPokemonResource(null)
      return
    }
    startTransition(() => {
      setPokemonResource(getPokemonResource(pokemonName))
    })
  }, [getPokemonResource, pokemonName, startTransition])

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className={`pokemon-info ${isPending ? 'pokemon-loading' : ''}`}>
        {pokemonResource ? (
          <PokemonErrorBoundary
            onReset={handleReset}
            resetKeys={[pokemonResource]}
          >
            <React.Suspense
              fallback={<PokemonInfoFallback name={pokemonName} />}
            >
              <PokemonInfo pokemonResource={pokemonResource} />
            </React.Suspense>
          </PokemonErrorBoundary>
        ) : (
          'Submit a pokemon'
        )}
      </div>
    </div>
  )
}

function AppWithProvider() {
  return (
    <PokemonCacheProvider cacheTime={5000}>
      <App />
    </PokemonCacheProvider>
  )
}

export default AppWithProvider
