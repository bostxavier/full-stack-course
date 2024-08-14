import { useState, useEffect } from 'react'
import axios from 'axios'

import Country from './components/Country'

const App = () => {
  const [countries, setCountries] = useState([])
  const [firstLetters, setFirstLetters] = useState('')
  const [selCountries, setSelCountries] = useState([])
  const [showSelCountry, setShowSelCountry] = useState({})

  const handleChange = (event) => {
    setFirstLetters(event.target.value)
  }

  useEffect(() => {
    const selection = countries.filter(c => {
      return c.toLowerCase().startsWith(firstLetters.toLowerCase())
    })
    const details = selection.reduce((acc, v) => {
      acc[v] = false
      return acc
    }, {})
    setShowSelCountry(details)
    setSelCountries(selection)
    }, [firstLetters])

  const showDetails = (c) => {
    const details = {...showSelCountry}
    details[c] = !details[c]
    setShowSelCountry(details)
  }

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        const commonNames = response.data.map(c => c.name.common)
        setCountries(commonNames)
      })
  }, [])

  return (
    <div>
      <form>
        find countries <input value={firstLetters} onChange={handleChange} />
      </form>
      <div>
        {selCountries.length > 10 ? 
          'Too many matches, specify another filter'
          :
          selCountries.length === 1 ? 
            <Country country={selCountries[0]} />
            :
            (
              <>
                {selCountries.map(c => {
                  return (
                    <div key={c}>
                      {c}{' '}
                      <button onClick={() => showDetails(c)}>{showSelCountry[c] === true ? 'hide' : 'show'}</button>
                      {showSelCountry[c] && <Country country={c} />}
                    </div>
                  )
                })}
              </>
            )}
      </div>
    </div>
  )
}

export default App

