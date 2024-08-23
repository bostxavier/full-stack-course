const jwt = require('jsonwebtoken')

const logger = require('./logger')
const User = require('../models/user')

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  else if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  }
  else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  let token = null
  if (authorization && authorization.startsWith('Bearer ')) {
    token = authorization.replace('Bearer ', '')
  }
  request.token = token

  next()
}

const userExtractor = async (request, response, next) => {
  let user = null

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (decodedToken.id) {
    user = await User.findById(decodedToken.id)
  }

  request.user = user

  next()
}

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor
}