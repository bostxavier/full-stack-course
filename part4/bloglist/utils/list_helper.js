const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce(
    (acc, v) => acc + v.likes,
    0
  )
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const idx = blogs.reduce(
    (argmax, blog, index) => blog.likes > blogs[argmax].likes ? index : argmax
    ,
    0
  )

  const { _id, __v, ...rest } = blogs[idx]

  return rest
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const nbBlogs = blogs
    .reduce(
      (acc, v) => {
        acc[v.author] === undefined ? acc[v.author] = 1 : acc[v.author] += 1
        return acc
      },
      {}
    )

  const sortedArray = Object.entries(nbBlogs)
    .map(([k, v]) => {
      return { author: k, blogs: v }
    })
    .sort((a, b) => b.blogs - a.blogs)

  return sortedArray[0]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}