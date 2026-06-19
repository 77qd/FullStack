import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [search, setSearch] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setAllCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  const countriesToShow = search
    ? allCountries.filter(country => 
        country.name.common.toLowerCase().includes(search.toLowerCase())
      )
    : []

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