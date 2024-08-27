import React from 'react'
import { useState } from 'react'

const Blog = ({ blog, updateBlog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleShowDetails = () => setShowDetails(!showDetails)

  const addLike = () => {
    const updatedBlog = {
      user: blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    updateBlog(blog.id, updatedBlog)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} {' '}
        <button onClick={toggleShowDetails}>{showDetails ? 'hide' : 'view'}</button>
      </div>
      {showDetails && (
        <>
          <div>
            {blog.url}
          </div>
          <div>
            likes {blog.likes}
            <button onClick={addLike}>like</button>
          </div>
          <div>
            {blog.user.name}
          </div>
          <button style={{backgroundColor: '#008CBA'}}>remove</button>
        </>
      )}
    </div>
  )
}

export default Blog