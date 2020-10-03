// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import React from 'react'

function countReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {count: state.count + action.step}
    default:
      return state
  }
}

function Counter({initialCount = 0, step = 1}) {
  const [state, dispath] = React.useReducer(countReducer, {
    count: initialCount,
  })
  const {count} = state
  const increment = () => dispath({type: 'INCREMENT', step})

  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
