const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcrypt');
const User = require('../db/models/user.model');

// Configurar Local Strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return done(null, false, { message: 'Contraseña incorrecta' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Configurar GitHub Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET, 
  callbackURL: 'http://localhost:8080/api/sessions/callbackGithub',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Buscar o crear un usuario en tu base de datos utilizando la información de GitHub
    let user = await User.findOne({ githubId: profile.id });

    if (!user) {
      // Si el usuario no existe, crea uno nuevo
      user = new User({
        name: profile.displayName || 'Usuario GitHub',
        githubId: profile.id,
        // Puedes incluir otros campos como el email si está disponible en el perfil de GitHub
      });
      await user.save();
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Resto de la configuración Passport
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
module.exports = passport;
