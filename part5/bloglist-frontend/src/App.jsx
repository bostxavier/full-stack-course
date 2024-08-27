import React from 'react'
import { useState, useEffect } from 'react'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [info, setInfo] = useState({ message: null})

  const notifyWith = (message, type='info') => {
    setInfo({
      message, type
    })

    setTimeout(() => {
      setInfo({ message: null} )
    }, 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBloglistappUser', JSON.stringify(user)
      ) 
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notifyWith(exception.response.data.error, 'error')
    }
  }
  
  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      notifyWith(`a new blog ${returnedBlog.title} by ${returnedBlog.author} has been created!`)
    } catch (exception) {
      notifyWith(exception.response.data.error, 'error')
    }
  }

  const updateBlog = async (blogId, blogObject) => {
    try {
      const returnedBlog = await blogService.update(blogId, blogObject)
      setBlogs(blogs.map(b => b.id === blogId ? returnedBlog : b))
    } catch (exception) {
      notifyWith(exception.response.data.error, 'error')
    }
  }

  const logout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBloglistappUser') 
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  console.log(blogs)

  if (user === null) {
    return (
      <>
        <h2>log in to application</h2>
        <Notification info={info} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </>
    )
  }

  return (
    <>
      <h2>blogs</h2>
      <Notification info={info} />
      <p>
        {`${user.name} logged in`}
        <button onClick={logout}>
          logout
        </button>
      </p>
      <Togglable buttonLabel='new blog'>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog key={blog.id} blog={blog} updateBlog={updateBlog} />)
      }
    </>
  )
}

export default App