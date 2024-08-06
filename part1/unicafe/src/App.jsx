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

const StatisticLine = ({text, value}) => {
  return (
    <div>
      {text} {value}
    </div>
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
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={good + neutral + bad} />
          <StatisticLine text="average" value={(good - bad) / (good + neutral + bad)} />
          <StatisticLine text="positive" value={`${good / (good + neutral + bad) * 100} %`} />
        </>
      ) :
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
