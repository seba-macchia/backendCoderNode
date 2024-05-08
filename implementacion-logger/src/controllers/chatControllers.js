const Messages = require("../models/chat.model");
const errorDictionary = require("../middleware/errorDictionary");
const { getLogger } = require('../config/logger.config');
const logger = getLogger(process.env.NODE_ENV);

async function getAllMessages(req, res) {
  try {
    let resp = await Messages.find();
    logger.info('Mensajes obtenidos correctamente.');
    res.send({
      msg: errorDictionary.SUCCESS, // Asumiendo que tienes un mensaje de éxito en tu dictionary
      data: resp
    });
  } catch (err) {
    logger.error('Error al obtener todos los mensajes:', err);
    res.status(500).send(err);
  }
}

async function createMessage(req, res) {
  try {
    const { user, message } = req.body;
    await Messages.create({ user, message });
    logger.info('Mensaje creado correctamente.');
    res.redirect("/chat");
  } catch (err) {
    logger.error('Error al crear el mensaje:', err);
    res.status(500).send(err);
  }
}

async function renderChatPage(req, res) {
  try {
    const messages = await Messages.find({ user: req.user.email });
    logger.info('Página de chat renderizada correctamente.');
    const messageData = messages.map(message => ({
      user: message.user,
      message: message.message
    }));
    res.render("chat", { messages: messageData, userEmail: req.user.email });
  } catch (error) {
    logger.error('Error al renderizar la página de chat:', error);
    res.status(500).send(errorDictionary.CHAT_ERROR);
  }
}

module.exports = {
  getAllMessages,
  createMessage,
  renderChatPage,
};