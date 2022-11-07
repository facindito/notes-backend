require('./database')
const express = require('express')
const { PORT } = require('./config')
const cors = require('cors')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const notesRoutes = require('./routes/notes.routes')

const app = express()

// middleware
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1>Welcome!!!</h1>')
})

app.use('/api/notes', notesRoutes)

app.use(notFound)
app.use(handleErrors)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
