const fieldsValidator = (fields = [], fieldsaRequired = []) => {
  let invalidFields = fields.filter(
    (field) => !fieldsaRequired.includes(field)
  );
  return { validate: invalidFields.length === 0 ? true : false };
};
module.exports = {
  fieldsValidator,
};
