const loggerController = {};

loggerController.loggerTest = (req, res) => {
  const logger = req.logger;

  logger.debug('Este es un mensaje de debug');
  logger.debug('Este es un mensaje http');
  logger.info('Este es un mensaje de info');
  logger.warn('Este es un mensaje de advertencia');
  logger.error('Este es un mensaje de error');
  logger.error('Este es un mensaje fatal');

  const logMessages = [
    { level: 'debug', message: 'Este es un mensaje de debug' },
    { level: 'http', message: 'Este es un mensaje http' },
    { level: 'info', message: 'Este es un mensaje de info' },
    { level: 'warning', message: 'Este es un mensaje de advertencia' },
    { level: 'error', message: 'Este es un mensaje de error' },
    { level: 'fatal', message: 'Este es un mensaje fatal' }
  ];

  res.json({ 
    message: 'Prueba del logger completada', 
    logMessages: logMessages 
  });
};

module.exports = loggerController;
