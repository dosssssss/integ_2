function validationError(res, errors) {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors,
  });
}

module.exports = {
  validationError,
};