import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const anecdoteSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        filterChange(state, action) {
            return action.payload
        }  
    }
})

export const { filterChange } = anecdoteSlice.actions
export default anecdoteSlice.reducer