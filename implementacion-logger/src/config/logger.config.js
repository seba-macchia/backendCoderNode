const { createLogger, transports, format } = require('winston');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const levels = {
  debug: 0,
  http: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5,
};

const colors = {
  debug: 'grey',
  http: 'cyan',
  info: 'green',
  warn: 'yellow',
  error: 'red',
  fatal: 'magenta',
};

const developmentLogger = createLogger({
  levels: levels,
  format: format.combine(
    format.colorize({ all: true }), // Aplicar colores a todos los mensajes
    format.simple()
  ),
  transports: [
    new transports.Console({
      level: 'debug',
    }),
  ],
});

let productionLogger;

if (process.env.NODE_ENV === 'production') {
  // Ruta del directorio logs
  const logsDirectory = path.join(__dirname, '..', 'dao', 'logs');

  // Verificar si el directorio logs existe, y si no, crearlo
  if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory, { recursive: true });
  }

  // Configuración del transporte de archivo solo en producción
  productionLogger = createLogger({
    levels: levels,
    format: format.combine(
      format.colorize({ all: true }), // Aplicar colores a todos los mensajes
      format.simple()
    ),
    transports: [
      new transports.Console({
        level: 'info',
      }),
      new transports.File({
        filename: path.join(logsDirectory, 'error.log'),
        level: 'info', // Cambiar el nivel de log a 'info'
      }),
    ],
  });
} else {
  // Si no estamos en producción, asignamos un logger de consola para el desarrollo
  productionLogger = createLogger({
    levels: levels,
    format: format.combine(
      format.colorize({ all: true }), // Aplicar colores a todos los mensajes
      format.simple()
    ),
    transports: [
      new transports.Console({
        level: 'info',
      }),
    ],
  });
}

function getLogger(env, level) {
  if (env === 'production') {
    return productionLogger;
  } else {
    const logger = developmentLogger;
    logger.transports[0].level = level; // Asignar el nivel adecuado
    return logger;
  }
}

module.exports = {
  getLogger,
  levels: levels,
};
