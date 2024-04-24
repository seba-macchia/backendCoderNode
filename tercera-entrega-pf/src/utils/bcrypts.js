const bcrypt = require("bcrypt");
const createHash = (password) => {
  let pass = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  return pass;
};
const isValid = (passwordEntered, passwordDb) => {
  let decrypt = bcrypt.compareSync(passwordEntered, passwordDb);
  return decrypt;
};

module.exports = { createHash, isValid };