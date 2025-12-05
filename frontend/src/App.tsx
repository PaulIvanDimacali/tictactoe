import { useEffect, useState } from 'react'

import './App.css'

type GameState = {
  id:string
  board: (string | null)[]
  next_player: string
  winner: string | null
  draw: boolean
}

function App() {
  return (
    <div>
      <TicTacoToe />
    </div>
  )
}

const API_BASE = 'https://tictactoeserver-tvrt.onrender.com/'

const TicTacoToe = () => {
  const [game, setGame] = useState<GameState | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        await fetch(`${API_BASE}/hello-world`)
      } catch (err) {
        console.error('hello-world fetch failed', err)
      }
    })()
  }, [])

  const startGame = async () => {
    try {
      const response = await fetch(`${API_BASE}/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      setGame(data)
    } catch (error) {
      console.error('Error starting game:', error)
    }
  }

  const handleCellClick = async (index: number) => {
    if (!game) {
      return
    }
    if (game.winner || game.draw) {
      return
    } 
    if (game.board[index] !== null ) {
      return
    }

    try {
      const response = await fetch(`${API_BASE}/games/${game.id}/moves`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ position: index , player: game.next_player }),
      })
      const data = await response.json()
      setGame(data)
    } catch (error) {
      console.error('Error making move:', error)
    } 
  }

  return (
    <div className='container'>
      <h1 className='title'>Tic Tac Toe</h1>
      <div className='board'>
        <div className='row1'>
          {renderBox(0)}
          {renderBox(1)}
          {renderBox(2)}
        </div>
        <div className='row2'>
          {renderBox(3)}
          {renderBox(4)}
          {renderBox(5)}  
        </div>
        <div className='row3'>
          {renderBox(6)}
          {renderBox(7)}
          {renderBox(8)}
        </div>
      </div>
      <button onClick={startGame}>
        {game ? 'Restart Game' : 'Start Game'}  
      </button>
      <div style={{marginTop: 8}}>
        <>
          <div>Next: {game?.next_player}</div>
          <div>Winner: {game?.winner || 'None'}</div>
        </>
      </div>
    </div>
  )

  function renderBox(i: number) {
    const value = game?.board?.[i] ?? ''
    const emoji = value === 'X' ? '❌' : value === 'O' ? '⭕' : null
    return (
      <div
        key={i}
        className='box'
        onClick={() => handleCellClick(i)}
        role='button'
        aria-label={`square-${i}`}
        style={{cursor: game && !game.winner && !game.draw ? 'pointer' : 'default'}}
      >
        {emoji ? <span style={{fontSize: 32}}>{emoji}</span> : value}
      </div>
    )
  }
}

export default App
