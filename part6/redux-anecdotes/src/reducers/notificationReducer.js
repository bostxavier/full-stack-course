import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotification(state, action) {
            return action.payload
        },
        clearNotification() {
            return null
        }
    }
})

export const { setNotification, clearNotification } = notificationSlice.actions

export const newNotification = (text, seconds) => {
    return dispatch => {
        dispatch(setNotification(text))
        setTimeout(() => {
            dispatch(clearNotification())
        }, seconds * 1000)
    }
}

export default notificationSlice.reducer