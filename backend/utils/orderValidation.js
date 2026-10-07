function validateOrderItems(items) {
    if (!Array.isArray(items) || items.length === 0) {
      return "Order must contain at least one item";
    }
  
    for (const item of items) {
      if (!item.food) {
        return "Each item must have a food";
      }
  
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return "Quantity must be at least 1";
      }
  
      if (typeof item.price !== "number" || item.price < 0) {
        return "Price must be a valid number";
      }
    }
  
    return null;
  }
  
  module.exports = { validateOrderItems };