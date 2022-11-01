const express = require('express')
const PORT = 3000

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    date: '2019-05-30T18:39:34.091Z',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true,
  },
]

const app = express()

//middleware
app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const { id } = req.params
  const currentNote = notes.find((note) => note.id === Number(id))

  if (!currentNote) {
    res.status(404).end()
  }
  res.json(currentNote)
})

app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params
  notes = notes.filter((note) => note.id !== Number(id))
  res.status(204).end()
})

app.post('/api/notes', (req, res) => {
  const note = req.body

  const ids = notes.map((note) => note.id)
  const id = Math.max(...ids)

  if (!note) {
    return res.status(400).json({
      error: 'Note content missing',
    })
  }

  const newNote = {
    id: id + 1,
    content: note.content,
    date: new Date(),
    important: typeof note.important !== 'undefined' ? note?.important : false,
  }

  notes = [...notes, newNote]

  res.status(201).json(newNote)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
