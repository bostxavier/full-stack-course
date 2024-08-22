const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper.js')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)})

test('identifier property is named "id", not "_id"', async () => {
  const response = await api.get('/api/blogs')
  const firstBlog = response.body[0]
  assert('id' in firstBlog)
  assert(!('_id' in firstBlog))
})

test('a valid blog can be added ', async () => {
  await api
    .post('/api/blogs')
    .send(helper.newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

  assert(titles.includes('Go To Statement Considered Harmful'))
})

test('missing "likes" property defaults to "0" whenever a valid blog is added', async() => {
  const newBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('deletion of a blog succeeds with status code 204 if id is valid', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

  const titles = blogsAtEnd.map(r => r.title)
  assert(!titles.includes(blogToDelete.title))
})

describe('updating a blog', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const increment = 10

    const blogToUpdate = blogsAtStart[0]
    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + increment }

    const response = await api
      .put(`/api/blogs/${updatedBlog.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(response.body.likes, blogToUpdate.likes + increment)
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    const blogsAtStart = await helper.blogsInDb()

    const increment = 10

    const blogToUpdate = blogsAtStart[0]
    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + increment }

    await api
      .put(`/api/blogs/${validNonexistingId}`)
      .send(updatedBlog)
      .expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '66c757b3a4d772aff0283ad'

    const blogsAtStart = await helper.blogsInDb()

    const increment = 10

    const blogToUpdate = blogsAtStart[0]
    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + increment }

    await api
      .put(`/api/blogs/${invalidId}`)
      .send(updatedBlog)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})