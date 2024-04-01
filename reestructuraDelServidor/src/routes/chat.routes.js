const express = require('express');
const { Router } = express;
const route = Router();
const {
  getAllMessages,
  createMessage,
  renderChatPage,
} = require("../controllers/chatControllers.js");

route.get('/allMessages', getAllMessages);
route.post('/createMessage', createMessage);
route.get('/', renderChatPage);

module.exports = route;
