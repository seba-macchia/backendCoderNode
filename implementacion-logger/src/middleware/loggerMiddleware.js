const { createLogger, transports, format } = require('winston');

// Obtener el nivel de log del entorno
const logLevel = process.env.NODE_ENV === 'production' ? process.env.LOG_LEVEL_PROD : process.env.LOG_LEVEL_DEV;

// Definir el logger
const logger = createLogger({
  level: logLevel,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});

// Middleware de registro
module.exports = (req, res, next) => {
  req.logger = logger;
  next();
};
