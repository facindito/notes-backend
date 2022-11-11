const mongoose = require('mongoose')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { api, getAllUsers } = require('./helpers')

describe('creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password123', 10)

    const newUser = new User({
      username: 'testUsername',
      name: 'testName',
      passwordHash,
    })

    await newUser.save()
  })

  test('works as expected creating a fresh username', async () => {
    const usersAtStart = await getAllUsers()

    const newUser = {
      username: 'jamonyqueso',
      name: 'jamonqueso',
      password: '123qwe',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const userAtEnd = await getAllUsers()

    expect(userAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = userAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await getAllUsers()

    const newUser = {
      username: 'testUsername',
      name: 'testName',
      password: '123qwe',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error.errors.username.message).toContain(
      '`username` to be unique'
    )

    const userAtEnd = await getAllUsers()

    expect(userAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
  //server.close()
})
