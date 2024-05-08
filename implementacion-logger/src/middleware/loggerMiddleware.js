const { getLogger } = require('../config/logger.config');

const loggerMiddleware = (req, res, next) => {
  req.logger = getLogger(process.env.NODE_ENV); // Utilizamos el logger correspondiente al entorno
  next();
};

module.exports = loggerMiddleware;
