import { createSlice } from '@reduxjs/toolkit'

import anecdoteService from '../services/anecdotes'

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
        const newAnecdote = action.payload
        state.push(newAnecdote)
      },
      setAnecdotes(state, action) {
        return action.payload
      }
  }
})

export const { incrementVote, createAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export default anecdoteSlice.reducer