const { Router } = require("express");
const userManager = require("../public/dao/db/models/userManager.js");
const session = require("express-session");
const passport = require("../public/dao/config/passport.config.js");

const route = new Router();

const UserManager = new userManager();

const bcrypt = require("bcrypt");
const saltRounds = 10; // Número de rondas de sal para Bcrypt

// En la ruta de registro
route.post("/register", async (req, res) => {
  try {
    let userNew = req.body;
    userNew.name = req.body.name;
    userNew.username = req.body.email;

    // Hashear la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    userNew.password = hashedPassword;

    await UserManager.addUser(userNew);
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});

// En la ruta de inicio de sesión
route.post("/", async (req, res) => {
  let userLogin = req.body;
  let users = await UserManager.getUsers();
  let userFound = users.find((user) => user.email === userLogin.email);

  if (userFound) {
    // Verificar la contraseña hasheada
    const passwordMatch = await bcrypt.compare(
      userLogin.password,
      userFound.password
    );

    if (passwordMatch) {
      req.session.user = {
        username: userFound.email,
        rol:
          userFound.email === "adminCoder@coder.com" &&
          userFound.password === "adminCod3r123"
            ? "admin"
            : "usuario",
      };
      session.user = req.session.user;

      res.redirect("/api/products");
      return;
    }
  }

  res.send("Usuario o contraseña incorrecta");
});

route.get("/logout", async (req, res) => {
  req.session.destroy();
  (err) => {
    if (err) {
      console.log(err);
    }
  };
  res.redirect("/");
});

// Rutas para la autenticación de GitHub
route.get("/auth/github", passport.authenticate("github"));

route.get(
  "/api/sessions/callbackGithub",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/api/products");
  }
);
module.exports = route;
