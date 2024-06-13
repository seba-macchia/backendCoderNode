README para la Aplicación de Indumentaria
Descripción

Esta aplicación es un sistema de gestión para un ecommerce de indumentaria, diseñada para manejar productos y carritos de diferentes usuarios. Ofrece tres tipos de roles: usuario (comprador), admin y premium, cada uno con sus respectivas funcionalidades y restricciones. Se accede a través de un sistema de login y cuenta con una implementación de Swagger para probar las API sin necesidad de autenticación.
Contenido del README

    Configuración
    Uso
    Scripts Disponibles
    Estructura del Proyecto
    Dependencias
    Rutas

Configuración

Para ejecutar la aplicación localmente, sigue estos pasos:

  1.  Crea un archivo .env en la raíz del proyecto y configura las siguientes variables de entorno:

  PORT=8080
MONGO_URI=tu_uri_de_MongoDB
LOG_LEVEL_DEV=debug
LOG_LEVEL_PROD=info

# Credenciales para roles específicos
MAIL_PREMIUM=jose@mail.com
CONTRASENA_PREMIUM=1234
MAIL_ADMIN=admin@coder.com
CONTRASENA_ADMIN=Admin1234


  2.    Instala las dependencias necesarias con npm install.

Uso
Entorno de Desarrollo

Para iniciar en modo de desarrollo, ejecuta:

```
npm run dev 
```

Entorno de Producción

Para iniciar en modo de producción, ejecuta:

```
npm start
```

Pruebas

Para ejecutar las pruebas, utiliza:

```
npm test
```

Scripts Disponibles

  -  `npm run dev`: Inicia el servidor en modo de desarrollo utilizando nodemon.
  -  `npm start`: Inicia el servidor en modo de producción.
  -  `npm test`: Ejecuta las pruebas utilizando Mocha.

Estructura del Proyecto

El proyecto sigue esta estructura:

coder-backend/
├── .env
├── .gitignore
├── index.js
├── nodemon.json
├── package.json
├── package-lock.json
├── src/
│   ├── config/
│   ├── controllers/
│   ├── dao/
│   ├── docs/
│   ├── middleware/
│   ├── models/
│   ├── public/
│   ├── routes/
│   ├── services/
│   ├── socket/
│   ├── utils/
│   └── views/
├── tests/
└── uploads/

Dependencias

Este proyecto utiliza una variedad de dependencias, incluyendo pero no limitándose a:

  -  bcrypt
  -  commander
  -  connect-mongo
  -  cookie-parser
  -  cors
  -  dotenv
  -  express
  -  express-handlebars
  -  express-session
  -  faker
  -  jsonwebtoken
  -  mongoose
  -  mongoose-paginate-v2
  -  multer
  -  nodemailer
  -  nodemon
  -  passport
  -  passport-github2
  -  passport-jwt
  -  passport-local
  -  passport-local-mongoose
  -  socket.io
  -  supertest-session
  -  swagger-jsdoc
  -  swagger-ui-express
  -  sweetalert2
  -  uuid
  -  winston
  -  winston-daily-rotate-file

Rutas

Las rutas están organizadas en diferentes archivos:

  -  Auth Routes: Autenticación de usuarios.
  -  Carts Routes: Operaciones relacionadas con carritos de compra.
  -  Chat Routes: Funcionalidades de chat.
  -  Home Routes: Rutas principales de la aplicación.
  -  Logger Routes: Pruebas de logging.
  -  Main Routes: Montaje de todas las rutas principales.
  -  Products Routes: Operaciones relacionadas con productos.
  -  Realtime Products Routes: Operaciones en tiempo real para productos.
  -  Swagger Routes: Documentación de API sin autenticación.
  -  User Routes: Funcionalidades de usuario, incluyendo roles y gestión de documentos.

Auth Routes: Autenticación de usuarios

    POST /api/sessions/register
        Descripción: Registra un nuevo usuario en el sistema.
        Controlador: register

    POST /api/sessions/login
        Descripción: Permite a un usuario iniciar sesión.
        Controlador: login

    GET /api/sessions/login_github
        Descripción: Inicia el proceso de autenticación OAuth2 con GitHub.
        Controlador: loginGithub

    GET /api/sessions/login_github/callback
        Descripción: Callback para la autenticación con GitHub. Procesa el token y autentica al usuario.
        Controlador: loginGithubCallback

    POST /api/sessions/logout
        Descripción: Cierra sesión del usuario actual.
        Controlador: logout

    GET /api/sessions/current
        Descripción: Obtiene los detalles del usuario actualmente autenticado.
        Controlador: Función anónima

Carts Routes: Operaciones relacionadas con carritos de compra

    GET /api/carts/allCarts
        Descripción: Obtiene todos los carritos. Solo accesible para administradores.
        Controlador: getAllCarts

    GET /api/carts/:cid
        Descripción: Obtiene un carrito específico por su ID.
        Controlador: showCart
        Restricción: Solo accesible para usuarios premium o normales.

    POST /api/carts/addProdToCart/:cId/:pId
        Descripción: Agrega un producto específico a un carrito.
        Controlador: addProductToCart
        Restricción: Solo accesible para usuarios premium o normales.

    POST /api/carts/createCart
        Descripción: Crea un nuevo carrito.
        Controlador: createCart

    DELETE /api/carts/:cid/products/:pid
        Descripción: Elimina un producto específico de un carrito.
        Controlador: cartManager.delProdById
        Restricción: Solo accesible para administradores.

    DELETE /api/carts/:cid
        Descripción: Elimina un carrito específico.
        Controlador: deleteCart
        Restricción: Solo accesible para administradores.

    POST /api/carts/:cid/products
        Descripción: Elimina todos los productos de un carrito.
        Controlador: deleteAllProductsFromCart
        Restricción: Solo accesible para usuarios premium o normales.

    PUT /api/carts/:cid
        Descripción: Actualiza la información de un carrito específico.
        Controlador: cartManager.updateCart
        Restricción: Solo accesible para administradores.

    PUT /api/carts/:cid/products/:pid
        Descripción: Actualiza la cantidad de un producto en un carrito.
        Controlador: updateProductQuantity
        Restricción: Solo accesible para usuarios premium o normales.

    POST /api/carts/:cid/purchase
        Descripción: Realiza la compra de los productos en un carrito.
        Controlador: purchaseCart
        Restricción: Solo accesible para usuarios premium o normales.

Chat Routes: Funcionalidades de chat

    GET /api/chat/allMessages
        Descripción: Obtiene todos los mensajes del chat.
        Controlador: getAllMessages
        Restricción: Solo accesible para usuarios normales.

    POST /api/chat/createMessage
        Descripción: Crea un nuevo mensaje en el chat.
        Controlador: createMessage
        Restricción: Solo accesible para usuarios normales.

    GET /api/chat/
        Descripción: Renderiza la página principal del chat.
        Controlador: renderChatPage
        Restricción: Acceso público.

Home Routes: Rutas principales de la aplicación

    GET /
        Descripción: Renderiza la página principal de la aplicación.
        Controlador: renderHomePage
        Restricción: Acceso público.

Logger Routes: Pruebas de logging

    GET /api/logger/loggerTest
        Descripción: Endpoint de prueba para el sistema de logging.
        Controlador: loggerController.loggerTest
        Restricción: Acceso público.

Main Routes: Montaje de todas las rutas principales

    MONTAJE DE RUTAS
        Descripción: Incluye todas las rutas principales de la aplicación, como las de autenticación, productos, carritos y documentación Swagger.

Products Routes: Operaciones relacionadas con productos

    GET /api/products/
        Descripción: Obtiene todos los productos.
        Controlador: getAllProducts
        Restricción: Acceso público.

    GET /api/products/allProducts
        Descripción: Obtiene todos los productos. Solo accesible para administradores o usuarios premium.
        Controlador: getAllProductsAPI

    GET /api/products/prodById/:productId
        Descripción: Obtiene un producto por su ID.
        Controlador: getProductById

    GET /api/products/manager/
        Descripción: Renderiza la página de administración de productos.
        Controlador: renderManagerPage
        Restricción: Solo accesible para administradores o usuarios premium.

    POST /api/products/createProd
        Descripción: Crea un nuevo producto.
        Controlador: createProduct
        Restricción: Solo accesible para administradores o usuarios premium.

    PUT /api/products/updateProd/:id
        Descripción: Actualiza un producto existente por su ID.
        Controlador: updateProduct
        Restricción: Solo accesible para administradores o usuarios premium.

    DELETE /api/products/deleteProd/:id
        Descripción: Elimina un producto por su ID.
        Controlador: deleteProduct
        Restricción: Solo accesible para administradores o usuarios premium.

    GET /api/products/mockingproducts
        Descripción: Obtiene productos simulados.
        Controlador: generateSimulatedProducts
        Restricción: Acceso público.

Realtime Products Routes: Operaciones en tiempo real para productos

    GET /api/realtimeproducts/
        Descripción: Renderiza la página de productos en tiempo real.
        Controlador: renderRealTimeProductsPage
        Restricción: Acceso público.

    GET /api/realtimeproducts/realtimeproducts
        Descripción: Obtiene productos en tiempo real.
        Controlador: getRealTimeProducts

Swagger Routes: Documentación de API sin autenticación

    Rutas de Productos y Carritos
        Descripción: Todas las rutas de productos y carritos disponibles para probar utilizando Swagger sin autenticación.

User Routes: Funcionalidades de usuario, incluyendo roles y gestión de documentos

    GET /api/user/reset-password
        Descripción: Renderiza la página para restablecer la contraseña del usuario.
        Controlador: userControllers.renderResetPassword
        Restricción: Acceso público.

    POST /api/user/reset-password-email
        Descripción: Envía un correo electrónico para restablecer la contraseña del usuario.
        Controlador: userControllers.sendResetPasswordEmail
        Restricción: Acceso público.

    GET /api/user/reset-password/:token
        Descripción: Renderiza el formulario para establecer una nueva contraseña después de recibir el token.
        Controlador: userControllers.renderNewPasswordForm
        Restricción: Acceso público.

    POST /api/user/reset-password/:token
        Descripción: Procesa la solicitud para restablecer la contraseña usando el token recibido.
        Controlador: userControllers.resetPassword
        Restricción: Acceso público.

    PUT /api/user/premium/:uid
        Descripción: Cambia el rol de usuario entre premium y normal.
        Controlador: userControllers.toggleUserRole
        Restricción: Solo accesible para administradores.

    GET /api/user/all-users-emails
        Descripción: Obtiene todos los IDs de usuarios y sus correos electrónicos.
        Controlador: userControllers.getAllUserIdAndEmails
        Restricción: Solo accesible para administradores.

    POST /api/user/:uid/documents
        Descripción: Maneja la subida de documentos por parte de un usuario.
        Controlador: userControllers.uploadDocuments
        Restricción: Acceso para usuarios con permisos específicos.


Aclaración:
  Los archivos que sube el usuario, al guardar el nombre, adelante pone la fecha y la hora actual para identificar el archivo, luego con el nombre que se le dió.