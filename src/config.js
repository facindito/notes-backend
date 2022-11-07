const { config } = require('dotenv')
config()

module.exports = {
  mongodbURL: process.env.MONGO_DB_URI,
  PORT: process.env.PORT || 3000,
}
