module.exports = (products = []) => {
  let total = 0;

  products.forEach((product) => {
    total += product?.price * product?.quantity;
  });

  return total;
};
