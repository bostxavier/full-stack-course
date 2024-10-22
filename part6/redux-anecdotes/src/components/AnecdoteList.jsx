import { useSelector, useDispatch } from 'react-redux'

import { incrementVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => {
        return state.anecdotes.filter(a => a.content.includes(state.filter))
    })
    const dispatch = useDispatch()

    const vote = anecdote => {
        dispatch(incrementVote(anecdote.id))
        dispatch(setNotification(`you voted '${anecdote.content}'`))
        setTimeout(() => {
            dispatch(setNotification(null))
        }, 5000)
    }

    return (
        <>
            {anecdotes
                .map(anecdote =>
                    <div key={anecdote.id}>
                        <div>
                            {anecdote.content}
                        </div>
                        <div>
                            has {anecdote.votes}
                            <button onClick={() => vote(anecdote)}>vote</button>
                        </div>
                    </div>
            )}
        </>
    )
}

export default AnecdoteList