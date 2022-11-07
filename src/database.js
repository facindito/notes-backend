const mongoose = require('mongoose')
const { mongodbURL, mongodbURLTest, NODE_ENV } = require('./config')

const connectionString =
  process.env.NODE_ENV === 'test' ? mongodbURLTest : mongodbURL

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
