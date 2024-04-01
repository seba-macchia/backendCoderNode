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
const messagesRoute = require("./src/routes/chat.routes.js");
const Chat = require("./src/models/chat.model.js");
const authRoutes = require("./src/routes/auth.routes.js");
const viewsRoutes = require("./src/routes/main.routes.js");

app.use(session({
  secret: 'mySecret', 
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://macchiasebastianprog:coder1234@codercluster.ictmdpz.mongodb.net/ecommerce',
  }),
  resave: false,
  saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

initializePassport(); // Llama a initializePassport antes de usar passport.initialize()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize()); // Llama a passport.initialize después de inicializar Passport

app.use('/api/sessions', authRoutes);
app.use("/msg", messagesRoute);
app.use('/', viewsRoutes);

const PORT = 8080 || process.env.PORT;
const server = http.createServer(app);
app.use(express.static(__dirname + "/public"));
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/src/views");

app.get("/chat", async (req, res) => {
  try {
    const messages = await Chat.find();
    res.render("chat", { messages });
  } catch (error) {
    console.error(`Error al obtener mensajes: ${error}`);
    res.status(500).send("Error al obtener mensajes");
  }
});

const io = new Server(server);
io.on("connection", (socket) => {
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
  console.log(`Escuchando en el puerto ${PORT}`);
  Database.connect()
    .then(() => {
      if (!server.listening) {
        server.listen(PORT, () => {
          console.log(`Escuchando en el puerto ${PORT}`);
        });
      }
    })
    .catch((error) => {
      console.error("Error al conectar a la base de datos:", error);
    });
});
