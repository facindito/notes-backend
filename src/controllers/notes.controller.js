const Note = require('../models/Note')

const getAllNotes = (req, res, next) => {
  Note.find({})
    .then((notes) => {
      res.json(notes)
    })
    .catch((err) => {
      next(err)
    })
}

const getOneNote = (req, res, next) => {
  const { id } = req.params

  Note.findById(id)
    .then((note) => {
      if (!note) {
        return res.status(404).end()
      }
      res.json(note)
    })
    .catch((err) => next(err))
}

const createNote = (req, res, next) => {
  const note = req.body

  if (!note.content) {
    return res.status(400).json({
      error: { message: 'Note content missing' },
    })
  }

  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: typeof note.important !== 'undefined' ? note.important : false,
  })

  newNote
    .save()
    .then((savedNote) => {
      res.status(201).json(savedNote)
    })
    .catch((err) => next(err))
}

const updateNote = (req, res, next) => {
  const { id } = req.params
  const note = req.body

  const newNoteInfo = {
    content: note.content,
    important: note.important,
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then((result) => {
      res.status(200).json(result)
    })
    .catch((err) => next(err))
}

const deleteNote = (req, res, next) => {
  const { id } = req.params

  Note.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end()
    })
    .catch((err) => next(err))
}

module.exports = {
  getAllNotes,
  getOneNote,
  createNote,
  updateNote,
  deleteNote,
}
