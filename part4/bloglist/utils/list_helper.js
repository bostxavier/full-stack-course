const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce(
    (acc, v) => acc + v.likes,
    0
  )
}

module.exports = {
  dummy,
  totalLikes
}