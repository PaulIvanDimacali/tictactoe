import { useEffect, useState } from 'react'

import './App.css'
import redCross from './assets/RED CROSS.png'
import sirCol from './assets/SIRCOL.png'

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

const API_BASE = 'http://localhost:8000'

const TicTacoToe = () => {
  const [msg, setMsg] = useState<string | null>(null)
  const [game, setGame] = useState<GameState | null>(null)

  useEffect(() => {
    fetch(`${API_BASE}/hello-world`)
    .then((res) => res.json())
    .then((data) => setMsg(data.message))
    .catch(() => setMsg('Error fetching message from server'))
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
      setMsg('Start a game first!')
      return
    }
    if (game.winner || game.draw) {
      setMsg('Game over! Start a new game.')
      return
    } 
    if (game.board[index] !== null ) {
      setMsg('Cell already occupied! Choose another one.')
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
    const img = value === 'X' ? redCross : value === 'O' ? sirCol : null
    return (
      <div
        key={i}
        className='box'
        onClick={() => handleCellClick(i)}
        role='button'
        aria-label={`square-${i}`}
        style={{cursor: game && !game.winner && !game.draw ? 'pointer' : 'default'}}
      >
        {img ? <img src={img} alt={value} style={{width: '100%', height: '100%', objectFit: 'contain'}} /> : value}
      </div>
    )
  }
}

export default App
