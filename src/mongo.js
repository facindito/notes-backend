const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

//connection to mongodb
mongoose
  .connect(connectionString)
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => {
    console.error('error connecting to MongoDB:', err.message)
  })

process.on('uncaughtException', () => {
  mongoose.connection.close()
})
