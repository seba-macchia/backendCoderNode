const express = require('express');

const { Router } = express;
const Messages = require('../public/dao/db/models/chat.model');
const route = Router();

route.get('/allMessages', async (req, res) => {
  try{
    let resp = await Messages.find()
    res.send({
      msg: "Mensajes encontrados",
      data: resp
    });
  }
  catch(err){
    res.send(err);
  }
  
})

route.post('/createMessage', async (req, res) => {
  try{
    await Messages.create(req.body)
    res.status(201).send({
      msg: "Mensaje creado",
      data: req.body
    })
  }
  catch(err){
    res.send(err);
  }
})

module.exports = route