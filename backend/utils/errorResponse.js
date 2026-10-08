function successResponse(res, statusCode, message, data = null) {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
}

function errorResponse(res, statusCode, message, errors = null) {
  const response = {
    success: false,
    message,
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
}

function validationError(res, errors) {
  return errorResponse(res, 400, 'Validation failed', errors);
}

module.exports = {
  successResponse,
  errorResponse,
  validationError,
};