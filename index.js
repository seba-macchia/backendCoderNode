const express = require('express')
const handlebars = require('express-handlebars')
// const homeRouter = require('./routes/home.routes.js')
// const realTimeProductsRouter = require('./routes/realTimeProducts.routes.js')
// const path = require('path')
const http = require('http')
const {Server} = require('socket.io')
const app = express()
// const ProductManager = require('./src/models/productManager')
const Database = require('./public/dao/db/database.js')
const productsRoute = require('./routes/products.routes.js')
const Products = require('./public/dao/db/models/productManager.model.js')
const messagesRoute = require('./routes/chat.routes.js')
const Chat = require('./public/dao/db/models/chat.model.js')

// esto es desde la base de datos
app.use(express.json());
app.use('/prod', productsRoute);
app.use('/msg', messagesRoute);

// Crear una instancia de ProductManager
// const productManager = new Products();

// const productManager = new ProductManager('./products.json')

const PORT = 8080 || process.env.PORT

// SERVER HTTP
const server = http.createServer(app);

// PUBLIC 
app.use(express.static(__dirname + '/public'))

// ENGINE (Motor de plantillas)
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + "/public/dao/views")

// Ruta para renderizar la página de inicio
app.get('/home', async (req, res) => {
  try {
    const products = await Products.find();
    res.render('home', { products });
  } catch (error) {
    console.error(`Error al obtener productos: ${error}`);
    res.status(500).send('Error al obtener productos');
  }
});

app.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await Products.find();
    res.render('realTimeProducts', { products });
  } catch (error) {
    console.error(`Error al obtener productos: ${error}`);
    res.status(500).send('Error al obtener productos');
  }
});

app.get('/chat', async (req, res) => {
  try {
    const messages = await Chat.find();
    res.render('chat', { messages });
  } catch (error) {
    console.error(`Error al obtener mensajes: ${error}`);
    res.status(500).send('Error al obtener mensajes');
  }
});


//ROUTES
// app.use('/home', homeRouter);
// app.use('/realTimeProducts', realTimeProductsRouter);


// SOCKET SERVER
const io = new Server(server)
io.on('connection', (socket) =>{
    console.log(`Nuevo cliente conectado ${socket.id}`)

  socket.on("getProducts", async () => {
    try {
      const products = await Products.find();
      socket.emit("productsData", products);
    } catch (error) {
      console.error("Error al obtener productos:", error.message);
    }
  });

  socket.on("new-product", async (data) => {
    try{
      const newProduct = new Products(data);
      await newProduct.save();
      const products = await Products.find();
      socket.emit("all-products", products);
    }
    catch (error) {
      console.error("Error al agregar producto:", error.message);
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      await Products.findByIdAndDelete(productId);
      socket.emit("productDeleted", productId);
      const products = await Products.find();
      socket.emit("all-products", products);
    } catch (error) {
      console.error("Error al eliminar producto:", error.message);
  }
  });

  socket.on('all-messages', async () => {
    const messages = await Chat.find();
    socket.emit('message-all', messages)
  })

  socket.on('new-message', async (data) => {
    const newMessage = new Chat(data);
    await newMessage.save();
    const messages = await Chat.find();
    socket.emit('message-all', messages)
  })
});

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