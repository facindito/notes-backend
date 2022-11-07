const mongoose = require('mongoose')
const { mongodbURL } = require('./config')

const connectionString = mongodbURL

//connection to mongodb
mongoose
  .connect(connectionString)
  .then((db) => {
    console.log(`Database ${db.connection.name} connected`)
  })
  .catch((err) => {
    console.error('error connecting to MongoDB:', err.message)
  })

process.on('uncaughtException', () => {
  mongoose.connection.close()
})
