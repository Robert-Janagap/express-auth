const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = validateRegisterInput = data => {
  let errors = {};
  let { name, password, password2, email } = data;

  email = !isEmpty(email) ? email : "";
  password = !isEmpty(password) ? password : "";

  if (!Validator.isEmail(email)) errors.email = "Email is invalid";

  if (Validator.isEmpty(email)) errors.email = "Email field is required";

  if (Validator.isEmpty(password))
    errors.password = "Password field is required";

  if (!Validator.isLength(password, { min: 6, max: 30 }))
    errors.password = "Password must be atleast 6 characters";

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
