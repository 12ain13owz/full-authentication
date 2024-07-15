const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);

const newError = (status, message, logout) => {
  return Object.assign(new Error(message), { status, logout });
};

const hashPassowrd = (password) => {
  return bcrypt.hashSync(password, salt);
};

const comparePasswords = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

const removeWhitespace = (value) => {
  return value.replace(/^\s+|\s+$/gm, "");
};

const normalizeUnique = (value) => {
  return removeWhitespace(value).toLowerCase();
};

const extractRoleNames = (roles) => {
  return roles.map((role) => role.name);
};

const privateUserFields = [
  "password",
  "verificationCode",
  "passwordResetCode",
  "passwordExpired",
  "createdAt",
  "updatedAt",
];

module.exports = {
  newError,
  hashPassowrd,
  comparePasswords,
  removeWhitespace,
  normalizeUnique,
  extractRoleNames,
  privateUserFields,
};
