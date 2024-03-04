const { Router } = require("express");
const userManager = require("../public/dao/db/models/userManager.js");
const session = require('express-session');

const route = new Router();

const UserManager = new userManager();



route.post("/register", async (req, res) => {
  try{
    let userNew = req.body;
    userNew.name = req.body.name;
    userNew.username = req.body.email;
    userNew.password = req.body.password;
    await UserManager.addUser(userNew);

    res.redirect("/");
  } catch(error){
    console.error(error);
  }
  
});

route.post('/', async (req, res) => {
  let userLogin = req.body;
  let users = await UserManager.getUsers();
  let userFound = users.find(user => userLogin.email == userLogin.email && user.password == userLogin.password);
  if (userFound){
    req.session.user = {
      username : userFound.email,
      rol : (userFound.email ===  "adminCoder@coder.com" && userFound.password === "adminCod3r123") ? "admin" :"usuario",
    }
    session.user = req.session.user
  
    res.redirect('/api/products')
    return
  }
  res.send('Usuario o contraseña incorrecta')
})

route.get('/logout', async(req, res) => {
  req.session.destroy(); (err) => {
    if (err) {
      console.log(err)
    }
  }
  res.redirect('/')
  });


module.exports = route