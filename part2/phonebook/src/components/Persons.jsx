import Person from './Person'
import personService from '../services/persons'

const Persons = ({persons, setPersons, filter}) => {
    const deletePerson = person => {
        const confirm = window.confirm(`Delete ${person.name}?`)

        if (confirm) 
            personService.deleteEntry(person.id)
                .then(response => {
                    if (response.statusText === 'OK')
                        setPersons(persons.filter(p => p.id !== person.id))
                 })
    }

    const filteredPersons = persons.filter(
        person => person.name.toLowerCase().startsWith(filter.toLowerCase()))

    return (
        <>
            {filteredPersons.map(person => 
                <Person key={person.id}
                        person={person}
                        deletePerson={() => deletePerson(person)} />)}
        </>
    )
}

export default Persons