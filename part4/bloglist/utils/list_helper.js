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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}