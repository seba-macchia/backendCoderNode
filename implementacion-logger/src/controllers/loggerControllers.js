const { getLogger } = require('../config/logger.config');

const loggerController = {};

loggerController.loggerTest = (req, res) => {
  // Aquí usas process.env.NODE_ENV para obtener el entorno actual
    const logger = getLogger(process.env.NODE_ENV);
        logger.fatal('Este es un mensaje fatal');
        logger.error('Este es un mensaje de error');
        logger.warning('Este es un mensaje de advertencia');
        logger.info('Este es un mensaje de info');
        logger.http('Este es un mensaje http');
        logger.debug('Este es un mensaje de debug');
    

    const logMessages = [
        { level: 'fatal', message: 'Este es un mensaje fatal' },
        { level: 'error', message: 'Este es un mensaje de error' },
        { level: 'warning', message: 'Este es un mensaje de advertencia' },
        { level: 'info', message: 'Este es un mensaje de info' },
        { level: 'http', message: 'Este es un mensaje http' },
        { level: 'debug', message: 'Este es un mensaje de debug' }
    ];

    res.json({ 
        message: 'Prueba del logger completada', 
        logMessages: logMessages 
    });
};

module.exports = loggerController