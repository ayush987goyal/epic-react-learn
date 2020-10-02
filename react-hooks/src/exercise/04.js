// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import React from 'react'
import {useLocalStorageState} from '../utils'

function Board({squares, onSelectSquare}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onSelectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

const initialHistory = [Array(9).fill(null)]

function Game() {
  const [history, setHistory] = useLocalStorageState(
    'game-history',
    initialHistory,
  )
  const [currentStep, setCurrentStep] = useLocalStorageState('current-step', 0)

  const currentSquares = history[currentStep]
  const nextValue = React.useMemo(() => calculateNextValue(currentSquares), [
    currentSquares,
  ])
  const winner = React.useMemo(() => calculateWinner(currentSquares), [
    currentSquares,
  ])
  const status = React.useMemo(
    () => calculateStatus(winner, currentSquares, nextValue),
    [nextValue, currentSquares, winner],
  )

  function selectSquare(square) {
    if (winner || currentSquares[square]) return

    const squaresCopy = [...currentSquares]
    squaresCopy[square] = nextValue

    const historyCopy = history.slice(0, currentStep + 1)
    historyCopy.push(squaresCopy)

    setHistory(historyCopy)
    setCurrentStep(historyCopy.length - 1)
  }

  function restart() {
    setHistory(initialHistory)
    setCurrentStep(0)
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSquares} onSelectSquare={selectSquare} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>
          {history.map((_, i) => (
            <li key={i}>
              <button
                onClick={() => setCurrentStep(i)}
                disabled={i === currentStep}
              >
                Go to {i === 0 ? 'game start' : `move #${i}`}{' '}
                {i === currentStep ? '(current)' : ''}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
