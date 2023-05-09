const print = require("../../log/print");

const fieldsValidator = (fields = [], fieldsaRequired = []) => {
  let invalidFields = fields.filter(
    (field) => !fieldsaRequired.includes(field)
  );
  print({ invalidFields });
  return { validate: invalidFields.length === 0 ? true : false };
};
module.exports = {
  fieldsValidator,
};
