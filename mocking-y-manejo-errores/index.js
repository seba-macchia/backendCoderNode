const express = require("express");
const passport = require('passport');
const { initializePassport } = require('./src/config/passport.config.js');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const handlebars = require("express-handlebars");
require('dotenv').config();
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const Database = require("./src/config/database.js");
const productsRoute = require("./src/routes/products.routes.js");
const cartsRoute = require("./src/routes/carts.routes.js");
const chatRoutes = require("./src/routes/chat.routes.js");
const messagesRoute = require("./src/routes/chat.routes.js");
const authRoutes = require("./src/routes/auth.routes.js");
const viewsRoutes = require("./src/routes/main.routes.js");
const errorDictionary = require('./src/middleware/errorDictionary');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
  secret: 'mySecret', 
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // Usar la variable de entorno para la URL de MongoDB
  }),
  resave: false,
  saveUninitialized: false
}));

initializePassport(); // Llama a initializePassport antes de usar passport.initialize()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize()); // Llama a passport.initialize después de inicializar Passport

app.use('/api/sessions', authRoutes);
app.use("/msg", messagesRoute);
app.use('/', viewsRoutes);
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/src/views");

app.use("/chat", chatRoutes);

const PORT = process.env.PORT || 8080; // Usar la variable de entorno para el puerto
const server = http.createServer(app);

const io = new Server(server);
io.on(errorDictionary.CONECTION_ESTABLISHED, (socket) => {
  console.log(`Nuevo cliente conectado ${socket.id}`);

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
  console.log(errorDictionary.LISTENING_PORT,`${PORT}`);
  Database.connect()
    .then(() => {
      console.log(errorDictionary.CONECTION_DATABASE);
    })
    .catch((error) => {
      console.error(errorDictionary.DATABASE_ERROR, error);
    });
});