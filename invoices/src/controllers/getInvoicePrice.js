const setMaterialsByOccurences = (materials = []) => {
  const counts = {};

  for (const material of materials) {
    counts[material._id] = counts[material._id]
      ? {
          quantity: material.quantity,
          count: counts[material._id].count + 1,
          updatedAt: material.updatedAt,
          createdAt: material.createdAt,
        }
      : {
          quantity: material.quantity,
          count: 1,
          updatedAt: material.updatedAt,
          createdAt: material.createdAt,
        };
  }

  return counts;
};

const getInvoicePrice = (products = []) => {
  let total = 0;

  products.forEach((product) => {
    total += product?.price;
  });

  return total;
};

module.exports = {
  getInvoicePrice,
  setMaterialsByOccurences,
};
