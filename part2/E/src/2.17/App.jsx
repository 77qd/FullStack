import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [infoMessage, setInfoMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = Math.random() < 0
    const foundPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    )

    if (foundPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        const changedPerson = { ...foundPerson, number: newNumber }

        personService
          .update(foundPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== foundPerson.id ? person : returnedPerson))
            setMessageType('success')
            setInfoMessage(`Updated number for ${returnedPerson.name}`)
            setTimeout(() => setInfoMessage(null), 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setMessageType('error')
            setInfoMessage(`Information of ${foundPerson.name} has already been removed from server`)
            setTimeout(() => setInfoMessage(null), 5000)
            setPersons(persons.filter(p => p.id !== foundPerson.id))
            setNewName('')
            setNewNumber('')
          })
      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber,
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setMessageType('success')
        setInfoMessage(`Added ${returnedPerson.name}`)
        setTimeout(() => setInfoMessage(null), 5000)
        setNewName('')
        setNewNumber('')
      })
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const personsToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      
      <Notification message={infoMessage} type={messageType} />

      <div>
        filter shown with <input value={filter} onChange={handleFilterChange} />
      </div>
      
      <h3>add a new</h3>
      <form onSubmit={addPerson}>
        <div>name: <input value={newName} onChange={handleNameChange} /></div>
        <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
        <div><button type="submit">add</button></div>
      </form>
      
      <h3>Numbers</h3>
      <ul>
        {personsToShow.map(person => 
          <li key={person.id}>
            {person.name} {person.number} {' '}
            <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
          </li>
        )}
      </ul>
    </div>
  )
}

export default App