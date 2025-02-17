// Utility function to convert array fields to comma-separated strings
const convertArrayFields = (formData, fields) => {
  fields.forEach((field) => {
    if (Array.isArray(formData[field])) {
      formData[field] = formData[field].join(",");
    }
  });
};

module.exports = convertArrayFields;
