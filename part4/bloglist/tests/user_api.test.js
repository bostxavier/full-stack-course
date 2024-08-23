const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper.js')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

describe('when there are initially some users saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
  })

  describe('addition of a new user', () => {
    test('succeeds with valid data', async () => {
      const newUser = {
        username: 'xbost',
        name: 'Xavier Bost',
        password: 'password'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes('xbost'))
    })
  })

  test('fails with status code 400 if username is missing', async () => {
    const newUser = {
      name: 'Xavier Bost',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
  })

  test('fails with status code 400 if password is missing', async () => {
    const newUser = {
      username: 'xbost',
      name: 'Xavier Bost',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
  })

  test('fails if username is too short', async () => {
    const newUser = {
      username: 'xb',
      name: 'Xavier Bost',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
  })

  test('fails if password is too short', async () => {
    const newUser = {
      username: 'xbost',
      name: 'Xavier Bost',
      password: 'pa'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
  })

  test('fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'hellas',
      name: 'Arto Hellas',
      password: 'secret string'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  after(async () => {
    await mongoose.connection.close()
  })
})