import { useState } from 'react'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <TicTacoToe />
    </div>
    </>
  )
}

const TicTacoToe = () => {
  return (
    <div className='container'>
      <h1 className='title'>Tic Tac Toe</h1>
      <div className='board'>
        <div className='row1'>
          <div className='box'></div>
          <div className='box'></div>
          <div className='box'></div>
        </div>
        <div className='row2'>
          <div className='box'></div>
          <div className='box'></div>
          <div className='box'></div>
        </div>
        <div className='row3'>
          <div className='box'></div>
          <div className='box'></div>
          <div className='box'></div>
        </div>
      </div>
      <button>Reset</button>
    </div>
  )
}

export default App
