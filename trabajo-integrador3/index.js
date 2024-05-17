const express = require("express");
const passport = require('passport');
const { initializePassport } = require('./src/config/passport.config.js');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const handlebars = require("express-handlebars");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const Database = require("./src/config/database.js");
const Chat = require("./src/models/chat.model.js");
const errorDictionary = require('./src/middleware/errorDictionary');
const loggerConfig = require('./src/config/logger.config.js');
const loggerRoutes = require('./src/routes/logger.routes.js');
const authRoutes = require("./src/routes/auth.routes.js");
const viewsRoutes = require("./src/routes/main.routes.js");
const messagesRoute = require("./src/routes/chat.routes.js");
const chatRoutes = require("./src/routes/chat.routes.js");
const userRoutes = require('./src/routes/user.routes.js');
const loggerMiddleware = require('./src/middleware/loggerMiddleware.js');
const config = require('./src/config/loger.commander.js');


// Cargar las variables de entorno
require('dotenv').config();

// Aplica el middleware de logger a todas las rutas
app.use(loggerMiddleware);

// Rutas
app.use('/logs', loggerRoutes);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
  secret: 'mySecret', 
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  }),
  resave: false,
  saveUninitialized: false
}));

initializePassport();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use('/api/sessions', authRoutes);
app.use("/msg", messagesRoute);
app.use('/', viewsRoutes);
app.use('/api/users', userRoutes);
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/src/views");

app.use("/chat", chatRoutes);

const PORT = config.port; // Utilizar el puerto definido en el archivo de configuración
const server = http.createServer(app);

const io = new Server(server);
io.on(errorDictionary.CONECTION_ESTABLISHED, (socket) => {
  const logger = loggerConfig.getLogger(process.env.NODE_ENV, process.env.LOG_LEVEL);
  logger.info(`Nuevo cliente conectado ${socket.id}`);

  socket.on("all-messages", async () => {
    const messages = await Chat.find();
    socket.emit("message-all", messages);
  });

  socket.on("new-message", async (data) => {
    const newMessage = new Chat(data);
    await newMessage.save();
    const messages = await Chat.find();
    socket.emit("message-all", messages);
  });
});

server.listen(PORT, () => {
  loggerConfig.getLogger(process.env.NODE_ENV, process.env.LOG_LEVEL).info(`${errorDictionary.LISTENING_PORT} ${PORT}`); 
  Database.connect()
    .then(() => {
      loggerConfig.getLogger(process.env.NODE_ENV, process.env.LOG_LEVEL).info(errorDictionary.CONECTION_DATABASE); 
    })
    .catch((error) => {
      loggerConfig.getLogger(process.env.NODE_ENV, process.env.LOG_LEVEL).error(`${errorDictionary.DATABASE_ERROR} ${error}`); 
    });
});
