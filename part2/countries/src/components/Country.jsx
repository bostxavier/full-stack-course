import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ country }) => {
    const [capital, setCapital] = useState('')
    const [area, setArea] = useState('')
    const [languages, setLanguages] = useState([])
    const [flagUrl, setFlagUrl] = useState(null)


    useEffect(
        () => {
            axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
                .then(response => {
                    setCapital(response.data.capital[0])
                    setArea(response.data.area)
                    setLanguages(Object.entries(response.data.languages))
                    setFlagUrl(response.data.flags.png)
                })
        }, [])

    return (
        <>
            <h2>{country}</h2>
            <div>
                <div>
                    capital {capital}
                </div>
                <div>
                    area {area}
                </div>
            </div>
            <h3>languages</h3>
            <ul>
                {languages.map(([key, value]) => <li key={key}>{value}</li>
                )}
            </ul>
            {flagUrl && (
                <img src={flagUrl} />
            )}
        </>
    )
}

export default Country