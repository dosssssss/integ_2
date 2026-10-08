// MENU-BE-05: Validate food information
// Express middleware that checks food data before it reaches the controller.

const { validationError } = require('../utils/errorResponse');

function validateFood(req, res, next) {
  const { name, description, price } = req.body || {};
  const errors = [];

  if (typeof name !== 'string' || name.trim() === '') {
    errors.push('Name is required');
  }

  if (typeof description !== 'string' || description.trim() === '') {
    errors.push('Description is required');
  }

  if (price === undefined || price === null || price === '') {
    errors.push('Price is required');
  } else if (typeof price !== 'number' || price < 0) {
    errors.push('Price must be a number greater than or equal to 0');
  }

  if (errors.length) return validationError(res, errors);
  next();
}

module.exports = { validateFood };