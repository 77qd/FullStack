import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [search, setSearch] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setAllCountries(response.data)
      })
  }, [])

  const countriesToShow = search
    ? allCountries.filter(country => 
        country.name.common.toLowerCase().includes(search.toLowerCase())
      )
    : []

  const activeCountry = selectedCountry || (countriesToShow.length === 1 ? countriesToShow[0] : null)

  useEffect(() => {
    if (activeCountry && activeCountry.capital) {
      const capital = activeCountry.capital[0]
      const apiKey = import.meta.env.VITE_SOME_KEY
      
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${apiKey}`)
        .then(response => {
          setWeather(response.data)
        })
        .catch(error => {
          console.error(error)
          setWeather(null)
        })
    } else {
      setWeather(null)
    }
  }, [activeCountry])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  const renderCountryDetails = (country) => {
    return (
      <div>
        <h2>{country.name.common}</h2>
        <div>capital {country.capital ? country.capital[0] : 'N/A'}</div>
        <div>area {country.area}</div>
        
        <h3>languages:</h3>
        <ul>
          {Object.values(country.languages || {}).map((lang, index) => (
            <li key={index}>{lang}</li>
          ))}
        </ul>
        
        <img 
          src={country.flags.png} 
          alt={`Flag of ${country.name.common}`} 
          style={{ width: '150px', marginTop: '15px' }} 
        />

        {weather && (
          <div>
            <h3>Weather in {country.capital[0]}</h3>
            <div>temperature {weather.main.temp} Celsius</div>
            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
              alt={weather.weather[0].description} 
            />
            <div>wind {weather.wind.speed} m/s</div>
          </div>
        )}
      </div>
    )
  }

  const renderContent = () => {
    if (search === '') {
      return null
    }

    if (selectedCountry) {
      return renderCountryDetails(selectedCountry)
    }

    if (countriesToShow.length > 10) {
      return <div>Too many matches, specify another filter</div>
    }

    if (countriesToShow.length > 1) {
      return (
        <ul>
          {countriesToShow.map(country => (
            <li key={country.name.official}>
              {country.name.common} {' '}
              <button onClick={() => setSelectedCountry(country)}>show</button>
            </li>
          ))}
        </ul>
      )
    }

    if (countriesToShow.length === 1) {
      return renderCountryDetails(countriesToShow[0])
    }

    return <div>No matches found</div>
  }

  return (
    <div>
      <div>
        find countries <input value={search} onChange={handleSearchChange} />
      </div>
      {renderContent()}
    </div>
  )
}

export default App