import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import Filter from './components/Filter'
import AnecdoteList from './components/AnecdoteList'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import anecdoteService from './services/anecdotes'
import { setAnecdotes } from './reducers/anecdoteReducer'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    anecdoteService
      .getAll().then(anecdotes => dispatch(setAnecdotes(anecdotes)))
  }, [dispatch])
  
  return (
    <>
      <h2>Anecdotes</h2>
      <Notification/>
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </>
  )
}

export default App