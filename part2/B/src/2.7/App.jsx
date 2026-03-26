import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ])
  const [newName, setNewName] = useState('')

const addPerson = (event) => {
  event.preventDefault()

  const exists = persons.some(p => p.name === newName)

  if (exists) {
    alert(`${newName} is already added to phonebook`)
    return
  }

  const newPerson = { name: newName }

  setPersons(persons.concat(newPerson))
  setNewName('')
  }

  const handleChange = (event) => {
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleChange} />
        </div>
        <button type="submit">add</button>
      </form>

      <h2>Numbers</h2>
      {persons.map(p => <p key={p.name}>{p.name}</p>)}
    </div>
  )
}

export default App