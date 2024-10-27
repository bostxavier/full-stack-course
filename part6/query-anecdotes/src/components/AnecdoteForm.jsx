import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query' 

import { createAnecdote } from '../requests'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
    onError: () => {
      dispatch({type: 'UPDATE', payload: 'too short anecdote, must have length 5 or more'})
      setTimeout(() => {
        dispatch({type: 'UPDATE', payload: null})
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
    dispatch({type: 'UPDATE', payload: `new anecdote '${content}' created`})
    setTimeout(() => {
      dispatch({type: 'UPDATE', payload: null})
    }, 5000)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' defaultValue="Never attribute to malice that which can be adequately explained by stupidity."/>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
