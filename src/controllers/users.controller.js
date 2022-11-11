const User = require('../models/User')
const bcrypt = require('bcrypt')

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.json(users)
    })
    .catch((err) => next(err))
}

const createUser = async (req, res, next) => {
  const { username, name, password } = req.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const newUser = new User({
    username,
    name,
    passwordHash,
  })

  newUser
    .save()
    .then((saveUser) => {
      res.status(201).json(saveUser)
    })
    .catch((err) => next(err))
}

module.exports = {
  getAllUsers,
  createUser,
}
