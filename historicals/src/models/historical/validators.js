/**
 * @author <uchokomeny@gmail.com>
 * @param {String[]} fields [fields that you want to verify]
 * @param {String[]} fieldsaRequired [list of valid fields required ]
 * @returns {{validate:Boolean}} [object that content a validate field with boolean value true if fields are valided ,false otherwise]
 */
const fieldsValidator = (fields = [], fieldsaRequired = []) => {
  let invalidFields = fields.filter(
    (field) => !fieldsaRequired.includes(field)
  );
  return { validate: invalidFields.length === 0 ? true : false };
};
module.exports = {
  fieldsValidator,
};
