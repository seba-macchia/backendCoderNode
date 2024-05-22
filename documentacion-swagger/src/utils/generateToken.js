const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY || "mysecretkey";

function tokenGenerator(user) {
  const payload = {
    user: {
      id: user._id, // Aquí asumo que el id del usuario está almacenado en _id
    },
  };

  const options = {
    expiresIn: "1h", // Define la expiración del token como desees
  };

  return jwt.sign(payload, SECRET_KEY, options);
}

module.exports = {
  tokenGenerator,
  SECRET_KEY,
};
