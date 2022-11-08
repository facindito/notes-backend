const mongoose = require('mongoose')
const server = require('../index')
const Note = require('../models/Note')
const { api, initialNotes, getAllContentFromNotes } = require('./helpers')

beforeEach(async () => {
  await Note.deleteMany({})

  // Parallel
  // const notesObjects = initialNotes.map((note) => new Note(note))
  // const promises = notesObjects.map((note) => note.save())
  // await Promise.all(promises)

  // Sequential
  for (const note of initialNotes) {
    const notesObjects = new Note(note)
    await notesObjects.save()
  }
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are three notes', async () => {
  const { response } = await getAllContentFromNotes()
  expect(response.body).toHaveLength(initialNotes.length)
})

test('the first note is about testing', async () => {
  const { contents } = await getAllContentFromNotes()

  expect(contents).toContain('Aprendiendo testing con JEST y SUPERTEST')
})

test('a valid note can be added', async () => {
  const newNote = {
    content: 'Proximamente next js',
    important: true,
  }
  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const { contents, response } = await getAllContentFromNotes()

  expect(response.body).toHaveLength(initialNotes.length + 1)
  expect(contents).toContain(newNote.content)
})

test('note without content is not added', async () => {
  const newNote = {
    important: true,
  }
  await api.post('/api/notes').send(newNote).expect(400)

  const { response } = await getAllContentFromNotes()

  expect(response.body).toHaveLength(initialNotes.length)
})

test('a note can be deleted', async () => {
  const { response: firstResponse } = await getAllContentFromNotes()
  const { body: notes } = firstResponse
  const noteToDelete = notes[0]
  await api.delete(`/api/notes/${noteToDelete.id}`).expect(204)

  const { contents, response: secondResponse } = await getAllContentFromNotes()

  expect(secondResponse.body).toHaveLength(initialNotes.length - 1)
  expect(contents).not.toContain(noteToDelete.content)
})

test('a note that do not exist can not be deleted', async () => {
  await api.delete(`/api/notes/12335`).expect(400)

  const { response } = await getAllContentFromNotes()

  expect(response.body).toHaveLength(initialNotes.length)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
