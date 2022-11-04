module.exports = (error, req, res, next) => {
  console.error(error.name)

  if (error.name === 'CastError') {
    res.status(400).json({
      error: {
        message: 'malformatted id',
      },
    })
  } else if (error.name === 'ValidationError') {
    res.status(400).json({ error: { message: error.message } })
  } else {
    res.status(500).end()
  }
}
