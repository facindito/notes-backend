const User = require('../models/User')
const bcrypt = require('bcrypt')

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).populate('notes', {
      content: 1,
      date: 1,
    })
    res.json(users)
  } catch (err) {
    console.error(err)
    next(err)
  }
}

const createUser = async (req, res) => {
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
