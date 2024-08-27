import React from 'react'
import { useState } from 'react'

const Blog = ({ blog, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleShowDetails = () => setShowDetails(!showDetails)

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
            <button>like</button>
          </div>
          <div>
            {user.name}
          </div>
        </>
      )}
    </div>
  )
}

export default Blog