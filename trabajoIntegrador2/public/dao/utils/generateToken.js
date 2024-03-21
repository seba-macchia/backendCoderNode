const jwt = require("jsonwebtoken");
const SECRET_KEY = "coderSecret";

const tokenGenerator = (userData) => {
  const payload = {
    id: userData._id ? userData._id.toString() : '',
    email: userData.email,
    name: userData.name,
    lastname: userData.lastname,
    role: userData.role,
    cart: userData.cart ? userData.cart._id.toString() : '',
  };
  let token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  return token;
};

module.exports = { tokenGenerator, SECRET_KEY };