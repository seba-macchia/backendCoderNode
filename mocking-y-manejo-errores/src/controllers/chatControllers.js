const Messages = require("../models/chat.model");
const errorDictionary = require("../middleware/errorDictionary");

async function getAllMessages(req, res) {
  try {
    let resp = await Messages.find();
    res.send({
      msg: errorDictionary.CHAT_NOT_FOUND,
      data: resp
    });
  } catch (err) {
    res.send(err);
  }
}

async function createMessage(req, res) {
  try {
    // Recibe los datos del formulario
    const { user, message } = req.body;

    // Crea el mensaje en la base de datos
    await Messages.create({ user, message });

    // Envía una respuesta de éxito
    res.redirect("/chat");
  } catch (err) {
    // Maneja los errores
    res.status(500).send(err);
  }
}
async function renderChatPage(req, res) {
  try {
    // Obtener solo los mensajes del usuario actual
    const messages = await Messages.find({ user: req.user.email });

    // Desglosar el objeto antes de pasarlos a la plantilla
    const messageData = messages.map(message => ({
      user: message.user,
      message: message.message
    }));

    // Pasar el usuario actual y los mensajes a la plantilla
    res.render("chat", { messages: messageData, userEmail: req.user.email });
  } catch (error) {
    console.error(`Error al obtener mensajes: ${error}`);
    res.status(500).send(errorDictionary.CHAT_ERROR);
  }
}


module.exports = {
  getAllMessages,
  createMessage,
  renderChatPage,
};