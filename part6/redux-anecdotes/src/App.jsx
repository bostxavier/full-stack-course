import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import Filter from './components/Filter'
import AnecdoteList from './components/AnecdoteList'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { initializeAnecdotes } from './reducers/anecdoteReducer'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
   dispatch(initializeAnecdotes())
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