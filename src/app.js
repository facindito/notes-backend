require('./database')
const express = require('express')
const cors = require('cors')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const notesRoutes = require('./routes/notes.routes')
const usersRoutes = require('./routes/users.routes')
const loginRoutes = require('./routes/login.routes')

const app = express()

// middleware
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('<h1>Welcome!!!</h1>')
})

app.use('/api/notes', notesRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/login', loginRoutes)

app.use(notFound)
app.use(handleErrors)

module.exports = app
