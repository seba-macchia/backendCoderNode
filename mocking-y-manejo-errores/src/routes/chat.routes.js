const express = require('express');
const { Router } = express;
const route = Router();
const {
  getAllMessages,
  createMessage,
  renderChatPage,
} = require("../controllers/chatControllers.js");

const {isUser} = require("../middleware/authMiddleware.js");

route.get('/allMessages',isUser, getAllMessages);
route.post('/createMessage',isUser, createMessage);
route.get('/',isUser, renderChatPage);

module.exports = route;
