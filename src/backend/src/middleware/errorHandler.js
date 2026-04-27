function errorHandler(err, req, res, next) {
  console.error(err.stack);
  
  if (err.type === 'validation') {
    return res.status(400).json({ message: 'Validation error', errors: err.errors });
  }
  
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return res.status(409).json({ message: 'Resource already exists' });
  }
  
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = errorHandler;
