import { createSlice } from '@reduxjs/toolkit'

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: 0,
    votes: 0
  }
}

const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
      incrementVote(state, action) {
        const id = action.payload
        const anecdoteToChange = state.find(a => a.id === id)
        const changedAnecdote = {
          ...anecdoteToChange,
          votes: anecdoteToChange.votes + 1
        }
  
        return state
                .map(a => a.id === id ? changedAnecdote : a)
                .sort((a, b) => b.votes - a.votes)
      },
      createAnecdote(state, action) {
        const newAnecdote = asObject(action.payload)
        state.push(newAnecdote)
      },
      setAnecdotes(state, action) {
        return action.payload
      }
  }
})

export const { incrementVote, createAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer