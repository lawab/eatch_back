const fieldsValidator = (fields = [], fieldsaRequired = []) => {
  let invalidFields = fields.filter(
    (field) => !fieldsaRequired.includes(field)
  );
  console.log({ invalidFields });
  return { validate: invalidFields.length === 0 ? true : false };
};
module.exports = {
  fieldsValidator,
};
