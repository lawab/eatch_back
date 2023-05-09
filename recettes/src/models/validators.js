const fieldsValidator = (fields = [], fieldsRequired = []) => {
  let invalidFields = fields.filter((field) => !fieldsRequired.includes(field));
  return { validate: invalidFields.length === 0 ? true : false };
};
module.exports = {
  fieldsValidator,
};
