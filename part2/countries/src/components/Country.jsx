import { useState, useEffect } from 'react'
import axios from 'axios'
const apiKey = import.meta.env.VITE_OPENWEATHER_KEY

const Country = ({ country }) => {
    const [capital, setCapital] = useState('')
    const [area, setArea] = useState('')
    const [languages, setLanguages] = useState([])
    const [flagUrl, setFlagUrl] = useState(null)
    const [coord, setCoord] = useState(null)
    const [temp, setTemp] = useState('')
    const [windSpeed, setWindSpeed] = useState('')
    const [weatherIcon, setWeatherIcon] = useState(null)

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

    useEffect(() => {
        if (capital !== '') {
            axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${capital}&limit=1&appid=${apiKey}`)
                .then(response => {
                    const lat = response.data[0].lat
                    const long = response.data[0].lon
                    setCoord([lat, long])
                })
        }
    }, [capital])

    useEffect(() => {
        if (coord) {
            axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coord[0]}&lon=${coord[1]}&appid=${apiKey}`)
                .then(response => {
                    const kelvinTemp = response.data.main.temp
                    const celcTemp = Math.round(kelvinTemp - 273.15, 2)
                    setTemp(celcTemp)
                    setWeatherIcon(response.data.weather[0].icon)
                    setWindSpeed(response.data.wind.speed)
                })
        }
    }, [coord])

    return (
        <>
            <h1>{country}</h1>
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
            <h2>Weather in {capital}</h2>
            <div>temperature {temp} Celcius</div>
            {weatherIcon && <img src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}></img>}
            <div>wind {windSpeed} m/s</div>
        </>
    )
}

export default Country