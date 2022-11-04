require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/Note')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

// middleware
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes)
  })
})

app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params

  Note.findById(id)
    .then((note) => {
      if (!note) {
        return res.status(404).end()
      }
      res.json(note)
    })
    .catch((err) => next(err))
})

app.post('/api/notes', (req, res, next) => {
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
})

app.put('/api/notes/:id', (req, res, next) => {
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
})

app.delete('/api/notes/:id', (req, res, next) => {
  const { id } = req.params

  Note.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end()
    })
    .catch((err) => next(err))
})

app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
