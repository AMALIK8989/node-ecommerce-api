const buildSortQuery = (sortBy, order, allowedFields) => {
  if (!sortBy || !allowedFields.includes(sortBy)) return "";
  if (!order) order = "ASC";
  order = order.toUpperCase();

  if (!["ASC", "DESC"].includes(order)) order = "ASC";

  return ` ORDER BY ${sortBy} ${order} `;
};

module.exports = { buildSortQuery };
