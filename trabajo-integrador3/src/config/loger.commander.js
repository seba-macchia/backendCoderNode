const dotenv = require('dotenv');
const { Command } = require('commander');

const program = new Command(); // Crea la instancia de comandos de commander.

program
    .option('-d', 'Variable para debug', false)
    .option('-p <port>', 'Puerto del servidor', 9090)
    .option('--mode <mode>', 'Modo de trabajo', 'develop');
program.parse();

const environment = program.opts().mode || 'development'; 

dotenv.config({
  path: environment === "production" ? process.env.LOG_LEVEL_PROD : process.env.LOG_LEVEL_DEV
});

module.exports = {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    environment: environment 
};
