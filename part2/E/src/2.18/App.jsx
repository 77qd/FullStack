import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [search, setSearch] = useState('')
  const [allCountries, setAllCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setAllCountries(response.data)
      })
      .catch(error => {
        console.error('Błąd podczas pobierania danych o krajach:', error)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }
  const countriesToShow = search
    ? allCountries.filter(country => 
        country.name.common.toLowerCase().includes(search.toLowerCase())
      )
    : []
  const renderContent = () => {
    if (search === '') {
      return null
    }

    if (countriesToShow.length > 10) {
      return <div>Too many matches, specify another filter</div>
    }

    if (countriesToShow.length > 1) {
      return (
        <ul>
          {countriesToShow.map(country => (
            <li key={country.name.official}>
              {country.name.common}
            </li>
          ))}
        </ul>
      )
    }

    if (countriesToShow.length === 1) {
      const country = countriesToShow[0]
      
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