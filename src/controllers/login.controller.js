const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')

const login = async (req, res, next) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })

    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      res.status(401).json({
        error: {
          message: 'invalid user or password',
        },
      })
    }
    const userForToken = {
      id: user._id,
      username: user.username,
    }

    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60 * 24 * 7,
    })

    res.send({
      name: user.name,
      username: user.username,
      token,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { login }
