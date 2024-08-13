import { useState, useEffect } from 'react'
import axios from 'axios'

import Country from './components/Country'

const App = () => {
  const [countries, setCountries] = useState([])
  const [firstLetters, setFirstLetters] = useState('')
  const [selCountries, setSelCountries] = useState([])
  const [country, setCountry] = useState(null)

  const handleChange = (event) => {
    setFirstLetters(event.target.value)
  }

  useEffect(() => {
    const selection = countries.filter(c => {
      return c.toLowerCase().startsWith(firstLetters.toLowerCase())
    })
    setSelCountries(selection)
    }, [firstLetters])

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
                  return <div key={c}>{c}</div>
                })}
              </>
            )}
      </div>
    </div>
  )
}

export default App
