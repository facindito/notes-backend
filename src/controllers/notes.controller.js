const Note = require('../models/Note')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({}).populate('user', {
      username: 1,
      name: 1,
    })
    res.json(notes)
  } catch (err) {
    next(err)
  }
}

const getOneNote = async (req, res, next) => {
  const { id } = req.params
  try {
    const note = await Note.findById(id)

    if (!note) {
      return res.status(404).end()
    }
    res.json(note)
  } catch (err) {
    next(err)
  }
}

const getTokenFrom = (req) => {
  const authorization = req.get('authorization')
  return authorization && authorization.toLowerCase().startsWith('bearer ')
    ? authorization.substring(7)
    : null
}

const createNote = async (req, res, next) => {
  const { content, important = false } = req.body

  try {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return res.status(401).json({
        error: {
          message: 'token missing or invalid',
        },
      })
    }

    const { id: userId } = decodedToken
    const user = await User.findById(userId)

    if (!content) {
      return res.status(400).json({
        error: { message: 'Note content missing' },
      })
    }

    const newNote = new Note({
      content,
      date: new Date(),
      important,
      user: user._id,
    })
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    res.status(201).json(savedNote)
  } catch (err) {
    next(err)
  }
}

const updateNote = async (req, res, next) => {
  const { id } = req.params
  const note = req.body

  const newNoteInfo = {
    content: note.content,
    important: note.important,
  }
  try {
    const updateNote = await Note.findByIdAndUpdate(id, newNoteInfo, {
      new: true,
    })
    res.status(200).json(updateNote)
  } catch (err) {
    next(err)
  }
}

const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params

    await Note.findByIdAndDelete(id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAllNotes,
  getOneNote,
  createNote,
  updateNote,
  deleteNote,
}
