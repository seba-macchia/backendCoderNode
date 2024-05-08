const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Configuración de niveles y colores personalizados
const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'magenta',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'cyan',
        debug: 'gray'
    }
};

winston.addColors(customLevels.colors);

// Crear una carpeta de logs si aún no existe
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Formato común de logs
const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

// Transportes comunes
const transports = [
    new winston.transports.File({
        filename: path.join(logsDir, 'errors.log'),
        level: 'error',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        )
    }),
    new winston.transports.File({
        filename: path.join(logsDir, 'combined.log'),
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        )
    })
];

// Logger para desarrollo
const developmentLogger = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.splat(),
        winston.format.simple(),
        logFormat
    ),
    transports: [
        new winston.transports.Console({
            level: 'debug'
        }),
        ...transports // Añadiendo transportes comunes
    ]
});

// Logger para producción
const productionLogger = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.splat(),
        winston.format.simple(),
        logFormat
    ),
    transports: [
        new winston.transports.Console({
            level: 'info'
        }),
        ...transports // Añadiendo transportes comunes
    ]
});

// Función para obtener el logger correcto según el entorno
const getLogger = (env) => {
    return env === 'production' ? productionLogger : developmentLogger;
};

module.exports = {
    getLogger,
    customLevels: customLevels.levels
};