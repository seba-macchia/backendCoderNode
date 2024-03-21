const express = require("express");
const passport = require('passport');
const bodyParser = require("body-parser");
const { initializePassport } = require("./public/dao/config/passport.config.js");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const handlebars = require("express-handlebars");
require('dotenv').config();
// const homeRouter = require('./routes/home.routes.js')
// const realTimeProductsRouter = require('./routes/realTimeProducts.routes.js')
// const path = require('path')
const http = require("http");
const { Server } = require("socket.io");
const app = express();
// const ProductManager = require('./src/models/productManager')
const Database = require("./public/dao/db/database.js");
const productsRoute = require("./public/dao/routes/products.routes.js");
// const ProductManager = require("./public/dao/db/productManager");
// const productManager = new ProductManager();
const cartsRoute = require("./public/dao/routes/carts.routes.js");
// const CartManager = require("./public/dao/db/cartManager");
// const cartManager = new CartManager();
const messagesRoute = require("./public/dao/routes/chat.routes.js");
const Chat = require("./public/dao/db/models/chat.model.js");
// const passport = require("./public/dao/config/passport.config.js"); // Elimina esta línea
const authRoutes = require("./public/dao/routes/auth.routes.js");
const viewsRoutes = require("./public/dao/routes/views.routes.js");


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

// Inicializar Passport y usarlo en tus rutas
app.use(passport.initialize());
app.use('/api/sessions', authRoutes);

// esto es desde la base de datos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// app.use("/products", productsRoute);
app.use("/msg", messagesRoute);
// app.use('/api/products', productsRoute)
// app.use('/api/carts', cartsRoute)
app.use('/', viewsRoutes)

// Crear una instancia de ProductManager
// const productManager = new Products();

// const productManager = new ProductManager('./products.json')

const PORT = 8080 || process.env.PORT;

// SERVER HTTP
const server = http.createServer(app);

// PUBLIC
app.use(express.static(__dirname + "/public"));

// ENGINE (Motor de plantillas)
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/public/dao/views");

app.get("/chat", async (req, res) => {
  try {
    const messages = await Chat.find();
    res.render("chat", { messages });
  } catch (error) {
    console.error(`Error al obtener mensajes: ${error}`);
    res.status(500).send("Error al obtener mensajes");
  }
});

// SOCKET SERVER
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