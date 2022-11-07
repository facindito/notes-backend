const { config } = require('dotenv')
config()

module.exports = {
  mongodbURLTest: process.env.MONGO_DB_URI_TEST,
  mongodbURL: process.env.MONGO_DB_URI,
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV,
}
