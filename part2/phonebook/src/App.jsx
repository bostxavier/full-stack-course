import { useState, useEffect } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  
  useEffect(() => {
    personService.getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
    }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const alreadyRecorded = persons.find(person => person.name === newName)

    if (alreadyRecorded !== undefined) {
      const confirm = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (confirm) {
        const changedPerson = {...alreadyRecorded, number: newNumber}
        personService.update(alreadyRecorded.id, changedPerson)
          .then(changedPerson => {
            setPersons(persons.map(p => {
              return p.id !== changedPerson.id ? p : changedPerson
            }))
            setMessage({
              text: `Added ${changedPerson.name}`,
              success: true})
            setTimeout(() => setMessage(null), 5000)
          })
          .catch(error => {
            setMessage({
              text: `Information of ${alreadyRecorded.name} has already been removed from the server`,
              success: false})
            setTimeout(() => setMessage(null), 5000)
          })
        }
      }
    else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      personService.create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setMessage({
            text: `Added ${returnedPerson.name}`,
            success: true})
          setTimeout(() => setMessage(null), 5000)
        })
    }

    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} setPersons={setPersons} />
    </div>
  )
}

export default App
