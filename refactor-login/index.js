const express = require('express')
const handlebars = require('express-handlebars')
const realTimeProductsRouter = require('./routes/realTimeProducts.routes.js')
const chatRoutes = require('./routes/chat.routes.js')
// const path = require('path')
const app = express()
// const ProductManager = require('./src/models/productManager')
const Database = require('./public/dao/db/database.js')
const productsRoute = require('./routes/products.routes.js')
const Products = require('./public/dao/db/models/productManager.js')
const Chat = require('./public/dao/db/models/chat.model.js')
const http = require('http')
require('dotenv').config()

const viewsRoute = require('./routes/views.routes.js')

const homeRouter = require('./routes/home.routes.js')
// SERVER HTTP
const server = http.createServer(app)

// carrito
const cartsRouter = require('./routes/carts.routes.js');
// Socket
const {Server} = require('socket.io');
const socketService = require('./public/dao/socket/socket.js');
const session = require('express-session')
const MongoStore = require('connect-mongo')
const io = new Server(server);
const passport = require('./public/dao/config/passport.config.js');
const authRoutes = require('./routes/auth.routes.js')

app.use(session({
  secret: 'mySecret', 
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://macchiasebastianprog:coder1234@codercluster.ictmdpz.mongodb.net/ecommerce',
  }),
  resave: false,
  saveUninitialized: false
}));

// Inicializar Passport y usarlo en tus rutas
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/sessions', authRoutes);


const PORT = 8080 || process.env.PORT

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/', viewsRoute);
app.use('/api/products', productsRoute); 
// ruta de carritos
app.use('/api/carts', cartsRouter);
// PUBLIC 
app.use(express.static(__dirname + '/public'))

// ENGINE (Motor de plantillas)
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + "/public/dao/views")


app.use('/home', homeRouter);

app.use('/realtimeproducts', realTimeProductsRouter);

app.use('/chat', chatRoutes);



// Inicializacion del socket en el servidor
io.on('connection', (socket) => socketService(socket,io));
server.listen(PORT, () => {
  console.log(`Escuchando en el puerto ${PORT}`)
  Database.connect()
  .then(() => {
    if (!server.listening) {
      server.listen(PORT, () => {
        console.log(`Escuchando en el puerto ${PORT}`);
      });
    }
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });
})

module.exports = app