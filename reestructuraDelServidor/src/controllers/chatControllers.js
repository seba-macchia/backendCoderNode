const Messages = require("../models/chat.model");

async function getAllMessages(req, res) {
  try {
    let resp = await Messages.find();
    res.send({
      msg: "Mensajes encontrados",
      data: resp
    });
  } catch (err) {
    res.send(err);
  }
}

async function createMessage(req, res) {
  try {
    await Messages.create(req.body);
    res.status(201).send({
      msg: "Mensaje creado",
      data: req.body
    });
  } catch (err) {
    res.send(err);
  }
}

async function renderChatPage(req, res) {
  try {
    const messages = await Messages.find();
    res.render('chat', { messages });
  } catch (error) {
    console.error(`Error al obtener mensajes: ${error}`);
    res.status(500).send('Error al obtener mensajes');
  }
}

module.exports = {
  getAllMessages,
  createMessage,
  renderChatPage,
};
