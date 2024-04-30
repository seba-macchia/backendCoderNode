const errorDictionary = {
  // producto
  PRODUCT_NOT_FOUND: "Producto no encontrado",
  PRODUCT_FOUND: "El producto encontrado",
  PRODUCTS_OBTAINED_FOUND: "Productos obtenidos correctamente",
  PRODUCTS_OBTAINED_NOT_FOUND: "Error al obtener los productos.",
  INVALID_PRODUCT_ID: "El ID del producto es inválido",
  CANT_UPDATE_PRODUCT: "No se puede actualizar el producto",
  PRODUCT_ALREADY_EXISTS: "El producto ya existe",
  PRODUCT_NOT_EXISTS: "El producto no existe",
  PRODUCT_NOT_FOUND_IN_CART: "El producto no existe en el carrito",
  PRODUCT_NOT_FOUND_IN_CART_AND_NOT_FOUND: "El producto no existe en el carrito o no existe",
  PRODUCT_UPDATED:   "Producto actualizado con éxito",
  PRODUCTS_LISTED: "Listado de Productos",
  NO_MORE_PRODUCTS: "No hay más productos",
  PRODUCT_NOT_SHOWED: "El producto no se puede mostrar",
  ERROR_ADDING_PRODUCT: "Error al agregar el producto",
  PRODUCT_DELETED: "Producto eliminado",
  ERROR_APPEND_PRODUCT_ID: "Error al agregar el ID del producto",
  ERROR_SEARCHED_PRODUCT: "Error al buscar el producto",
  ERROR_MODIFY_AMOUNT_PRODUCT_ID: "Error al modificar la cantidad del producto por ID",
  

  // carrito de compras
  CART_NOT_FOUND: "Carrito no encontrado",
  CART_OBTAINED_FOUND:"Cart obtenido correctamente",
  CART_DELETED: "Carrito eliminado",
  CART_FOUND: "El carrito creado exitosamente",
  INVALID_CART_ID: "El ID del carrito es inválido",
  NOTCART_OBTAINED_ID: "No se pudo obtener el carrito por su ID",
  ERROR_CREATING_CART:" Error al crear el carrito",

  // ticket
  TICKET_NOT_FOUND: "Ticket no encontrado",
  TICKET_NOT_GENERATED:"No se pudo generar el ticket",

  // chat
  CHAT_NOT_FOUND: "Chat no encontrado",
  CHAT_ERROR:"Error al obteenr msjs",

  // otros
  GENERIC_ERROR:"algo salió mal",

  // usuario
  USER_NOT_FOUND: "Usuario no encontrado",
  USER_NOT_FOUND_ID: "Usuario no encontrado por su ID",
  ERROR_USER_NOT_CREATED: "Error al crear el usuario",
  USER_EXISTS: "El usuario ya existe",
  USER_NOT_ADMIN: "El usuario no es un administrador",
  USER_NOT_ADMIN_OR_USER_NOT_FOUND: "El usuario no es un administrador o no existe",
  
  // servidor
  INTERNAL_SERVER_ERROR: "Error interno del servidor",
  SERVER_PRODUCT_ERROR:'Error interno del servidor al actualizar la cantidad del producto',
  SERVER_CART_ERROR: "Error interno del servidor al agregar el producto al carrito",
  SERVER_CREATED_CART_ERROR: "Error interno del servidor al crear el carrito",
  SERVER_ELIMINATE_CART: "Error interno del servidor al eliminar el carrito",
  LISTENING_PORT: "Servidor escuchando en el puerto",
  CONECTION_ESTABLISHED: "Conección establecida",

  // base de datos
  DATABASE_ERROR: "Error en la base de datos",
  CONECTION_DATABASE: "Conexión a la base de datos exitosa",
};

module.exports = errorDictionary;
