const passport = require('passport');
const GitHubStrategy = require("passport-github2").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/user.model");
const UserManager = require("../services/userService.js");
const userManager = new UserManager();
require('dotenv').config();
const { tokenGenerator, SECRET_KEY } = require("../utils/generateToken.js");
const bcrypt = require("../utils/bcrypts.js");

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["cookieToken"];
  }
  return token;
};

const initializePassport = () => {
  passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: SECRET_KEY,
    },
    async (jwt_payload, done) => {
      try {
        // Verificar si el usuario ya existe en la base de datos
        const user = await userManager.getUserById(jwt_payload.user.id);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  "login_github",
  new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/api/sessions/login_github/callback',
      scope: ["user:email"],
    },
    async ( accessToken, refreshToken, profile, done) => {
      try {
        // Verificar si el usuario ya existe en la base de datos
        let user = await userManager.loginWithGitHub(profile); 
        // Llamar a la función `done` para indicar que la autenticación fue exitosa
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);



  passport.use(
    "login_local",
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await userManager.findUser(email);
          if (!user) {
            return done(null, false, { message: 'Correo electrónico incorrecto' });
          }
          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            return done(null, false, { message: 'Contraseña incorrecta' });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

initializePassport();

module.exports = {
  passport,
  initializePassport
};
