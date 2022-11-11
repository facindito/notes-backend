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
})

afterAll(() => {
  mongoose.connection.close()
  //server.close()
})
