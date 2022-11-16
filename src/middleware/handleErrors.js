const ERROR_HANDLERS = {
  CastError: (res) =>
    res.status(400).json({ error: { message: 'malformatted id' } }),

  ValidationError: (res, error) =>
    res.status(409).json({ error: { message: error.message } }),

  JsonWebTokenError: (res) =>
    res.status(401).json({ error: { message: 'invalid token' } }),

  TokenExpirerError: (res) =>
    res.status(401).json({ error: { message: 'token expired' } }),

  defaultError: (res, error) =>
    res.status(500).json({ error: { message: error.message } }),
}

module.exports = (error, req, res, next) => {
  console.error(error.name)

  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError

  handler(res, error)
}
