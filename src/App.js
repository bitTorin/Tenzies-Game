import React from "react"
import Die from "./components/Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {
  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [counter, setCounter] = React.useState(0)
  const [clock, setClock] = React.useState(0)
  const [ticking, setTicking] = React.useState(false)
  
  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSame = dice.every(die => die.value === firstValue)
    if (allHeld && allSame) {
      setTenzies(true)
      setTicking(false)
    }
  }, [dice])

  React.useEffect(() => {
    let interval;
    if (ticking) {
      interval = setInterval(() => {
        setClock((prevTime) => prevTime + 10);
      }, 10);
    } else if (!ticking) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [ticking])
  

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice;
  }

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6), 
      isHeld: false,
      id: nanoid()
    }
  }

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ? 
        {...die, isHeld: !die.isHeld} :
        die
    }))
  }

  function rollDice() {
    if (!tenzies) {
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ? 
          die :
          generateNewDie()
      }))
      setCounter(oldCount => oldCount + 1)
      setTicking(true)
    } else {
      setTenzies(false)
      setDice(allNewDice())
      setCounter(0)
      setClock(0)
      setTicking(false)
    }
    
  }

  const diceElements = dice.map(die => (
    <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)} />
  ))

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="stats">
        <div className="counter">
          <div className="countTitle">Counter: </div>
          <div className="countNum">{counter}</div>
        </div>
        <div className="time">
          <div className="timeTitle">Time: </div>
          {
            clock > 600000
            ?
            <div className="timeNum">
              <span>{("0" + Math.floor((clock / 60000) % 60)).slice(-2)}:</span>
              <span>{("0" + Math.floor((clock / 1000) % 60)).slice(-2)}:</span>
              <span>{("0" + ((clock / 10) % 100)).slice(-2)}</span>
            </div>
            : clock > 60000
              ?
              <div className="timeNum">
                <span>{("0" + Math.floor((clock / 60000) % 60)).slice(-1)}:</span>
                <span>{("0" + Math.floor((clock / 1000) % 60)).slice(-2)}:</span>
                <span>{("0" + ((clock / 10) % 100)).slice(-2)}</span>
              </div>
              :
              <div className="timeNum">
                <span>{("0" + Math.floor((clock / 1000) % 60)).slice(-2)}:</span>
                <span>{("0" + ((clock / 10) % 100)).slice(-2)}</span>
              </div>
          }
        </div>
      </div>
      <div className="diceContainer">
        {diceElements}
      </div>
      <button className="rollBtn" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
