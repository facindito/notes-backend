const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const initialNotes = [
  {
    content: 'Aprendiendo testing con JEST y SUPERTEST',
    important: true,
    date: new Date(),
  },
  {
    content: 'Otra nota importante',
    important: true,
    date: new Date(),
  },
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map((note) => note.content),
    response,
  }
}

module.exports = {
  api,
  initialNotes,
  getAllContentFromNotes,
}
