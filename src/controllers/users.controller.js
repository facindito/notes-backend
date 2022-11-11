const User = require('../models/User')
const bcrypt = require('bcrypt')

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
    res.json(users)
  } catch (err) {
    next(err)
  }
}

const createUser = async (req, res, next) => {
  try {
    const { username, name, password } = req.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
      username,
      name,
      passwordHash,
    })

    const saveUser = await newUser.save()
    res.status(201).json(saveUser)
  } catch (error) {
    res.status(400).json({ error })
  }
}

module.exports = {
  getAllUsers,
  createUser,
}
