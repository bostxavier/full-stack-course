import { useSelector, useDispatch } from 'react-redux'

import { vote } from '../reducers/anecdoteReducer'
import { newNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => {
        return state.anecdotes.filter(a => a.content.includes(state.filter))
    })
    const dispatch = useDispatch()

    const incrementVote = anecdote => {
        dispatch(vote(anecdote))
        dispatch(newNotification(`you voted '${anecdote.content}'`, 5))
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
                            <button onClick={() => incrementVote(anecdote)}>vote</button>
                        </div>
                    </div>
            )}
        </>
    )
}

export default AnecdoteList