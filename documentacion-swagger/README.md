# Descripción de las Rutas

## AUTH ROUTES

### /register
- Método: POST
- Descripción: Registro de usuario.
- Controlador: `register`

### /login
- Método: POST
- Descripción: Inicio de sesión.
- Controlador: `login`

### /login_github
- Método: GET
- Descripción: Inicio de sesión con GitHub.
- Controlador: `loginGithub`

### /login_github/callback
- Método: GET
- Descripción: Callback para inicio de sesión con GitHub.
- Controlador: `loginGithubCallback`

### /logout
- Método: POST
- Descripción: Cierre de sesión.
- Controlador: `logout`

### /current
- Método: GET
- Descripción: Obtiene los datos del usuario actual.
- Controlador: Retorna un DTO de usuario.

## ---------------------------------------------------------------------------------------------------------
## CARTS ROUTES

### /allCarts
- Método: GET
- Descripción: Obtiene todos los carritos (solo para administrador).
- Controlador: `getAllCarts`

### /:cid
- Método: GET
- Descripción: Obtiene un carrito específico (solo para usuarios).
- Controlador: `showCart`

### /addProdToCart/:cId/:pId
- Método: POST
- Descripción: Agrega un producto al carrito (solo para usuarios).
- Controlador: `addProductToCart`

### /createCart
- Método: POST
- Descripción: Crea un nuevo carrito.
- Controlador: `createCart`

### /:cid/products/:pid
- Método: DELETE
- Descripción: Elimina un producto específico del carrito (solo para administrador).
- Controlador: `cartManager.delProdById`

### /:cid
- Método: DELETE
- Descripción: Elimina un carrito específico (solo para administrador).
- Controlador: `deleteCart`

### /:cid/products
- Método: POST
- Descripción: Elimina todos los productos del carrito.
- Controlador: `deleteAllProductsFromCart`

### /:cid
- Método: PUT
- Descripción: Actualiza un carrito específico (solo para administrador).
- Controlador: `cartManager.updateCart`

### /:cid/products/:pid
- Método: PUT
- Descripción: Actualiza la cantidad de un producto en el carrito (solo para usuarios).
- Controlador: `updateProductQuantity`

### /:cid/purchase
- Método: POST
- Descripción: Realiza la compra del carrito.
- Controlador: `purchaseCart`

## --------------------------------------------------------------------------------------------------------
## CHAT ROUTES

### /allMessages
- Método: GET
- Descripción: Obtiene todos los mensajes.
- Controlador: `getAllMessages`

### /createMessage
- Método: POST
- Descripción: Crea un nuevo mensaje.
- Controlador: `createMessage`

### /
- Método: GET
- Descripción: Renderiza la página de chat.
- Controlador: `renderChatPage`

## -------------------------------------------------------------------------------------------------
## HOME ROUTES

### /
- Método: GET
- Descripción: Renderiza la página de inicio.
- Controlador: `renderHomePage`

## ------------------------------------------------------------------------------------------------
##  LOGGER

### /loggerTest
- Método: GET
- Descripción: Prueba de registro.
- Controlador: `loggerTest`

## ------------------------------------------------------------------------------------------------
## MAIN ROUTES

### /
- Método: GET
- Descripción: Renderiza la página de inicio de sesión.
- Controlador: `renderLoginPage`

### /login
- Método: GET
- Descripción: Renderiza la página de inicio de sesión.
- Controlador: `renderLoginPage`

### /register
- Método: GET
- Descripción: Renderiza la página de registro.
- Controlador: `renderRegisterPage`

### /profile
- Método: GET
- Descripción: Renderiza la página de perfil (requiere autenticación).
- Controlador: `renderProfilePage`
- Middleware: `auth` (requerido)

## --------------------------------------------------------------------------------------------------
## PRODUCTS ROUTES

### /
- Método: GET
- Descripción: Obtiene todos los productos.
- Controlador: `getAllProducts`

### /allProducts
- Método: GET
- Descripción: Obtiene todos los productos (requiere ser administrador o premium).
- Controlador: `getAllProductsAPI`
- Middleware: `isAdminOrPremium` (requerido)

### /prodById/:productId
- Método: GET
- Descripción: Obtiene un producto por su ID.
- Controlador: `getProductById`

### /manager/
- Método: GET
- Descripción: Renderiza la página de administrador de productos (requiere ser administrador o premium).
- Controlador: `renderManagerPage`
- Middleware: `isAdminOrPremium` (requerido)

### /createProd
- Método: POST
- Descripción: Crea un nuevo producto (requiere ser administrador o premium).
- Controlador: `createProduct`
- Middleware: `isAdminOrPremium` (requerido)

### /updateProd/:id
- Método: PUT
- Descripción: Actualiza un producto por su ID (requiere ser administrador o premium).
- Controlador: `updateProduct`
- Middleware: `isAdminOrPremium` (requerido)

### /deleteProd/:id
- Método: DELETE
- Descripción: Elimina un producto por su ID (requiere ser administrador o premium).
- Controlador: `deleteProduct`
- Middleware: `isAdminOrPremium` (requerido)

### /mockingproducts
- Método: GET
- Descripción: Obtiene productos simulados.
- Controlador: `generateSimulatedProducts`

## -----------------------------------------------------------------------------------------------------------
### REALTIMEPRODUCTS ROUTES

### /
- Método: GET
- Descripción: Renderiza la página de productos en tiempo real.
- Controlador: `renderRealTimeProductsPage`

### /realtimeproducts
- Método: GET
- Descripción: Obtiene productos en tiempo real.
- Controlador: `getRealTimeProducts`

## ------------------------------------------------------------------------------------------------------------
## USER ROUTES

### /reset-password
- Método: GET
- Descripción: Renderiza la página para restablecer contraseña.
- Controlador: `renderResetPassword`

### /reset-password-email
- Método: POST
- Descripción: Envía un correo electrónico para restablecer la contraseña.
- Controlador: `sendResetPasswordEmail`

### /reset-password/:token
- Método: GET
- Descripción: Renderiza el formulario para ingresar una nueva contraseña.
- Controlador: `renderNewPasswordForm`

### /reset-password/:token
- Método: POST
- Descripción: Restablece la contraseña.
- Controlador: `resetPassword`

### /premium/:uid
- Método: PUT
- Descripción: Cambia el estado de usuario a premium.
- Controlador: `toggleUserRole`

### /all-users-emails
- Método: GET
- Descripción: Obtiene todos los identificadores de usuario y sus correos electrónicos.
- Controlador: `getAllUserIdAndEmails`




