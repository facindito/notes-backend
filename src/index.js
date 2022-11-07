const app = require('./app')
const { PORT } = require('./config')

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = server
