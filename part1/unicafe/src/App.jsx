import { useState } from 'react'

const Button = ({value, setValue, text}) => {
  const increment = () => {
    setValue(value + 1)
  }

  return (
    <button onClick={increment} >
      {text}
    </button>
  )
}

const Statistics = ({good, neutral, bad}) => {
  return (
    <>
      <h1>
        statistics
      </h1>
      {(good + neutral + bad) > 0 ? (
        <>
          <div>
            good {good}
          </div>
          <div>
            neutral {neutral}
          </div>
          <div>
            bad {bad}
          </div>
          <div>
            all {good + neutral + bad}
          </div>
          <div>
            average {(good - bad) / (good + neutral + bad)}
          </div>
          <div>
            positive {good / (good + neutral + bad) * 100} %
          </div>
        </>
      )
      :
      (
        <div>
          No feedback given
        </div>
      )
    }
    </>
  )
}


const  App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <h1>
        give feedback
      </h1>
      <Button value={good} setValue={setGood} text="good" />
      <Button value={neutral} setValue={setNeutral} text="neutral" />
      <Button value={bad} setValue={setBad} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  )
}

export default App
