const { Router } = require('express')
const {
  getAllNotes,
  getOneNote,
  createNote,
  updateNote,
  deleteNote,
} = require('../controllers/notes.controller')

const router = Router()

router.get('/', getAllNotes)

router.get('/:id', getOneNote)

router.post('/', createNote)

router.put('/:id', updateNote)

router.delete('/:id', deleteNote)

module.exports = router
