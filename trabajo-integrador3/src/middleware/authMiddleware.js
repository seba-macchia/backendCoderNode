const isAdmin = (req, res, next) => {
  // Verificar si el usuario es un administrador
  if (req.session.user && req.session.user.role === 'admin') {
    // Configurar req.user con la información del usuario almacenada en req.session.user
    req.user = req.session.user;
    // Permitir acceso si es un administrador
    next();
  } else {
    // Denegar acceso si no es un administrador
    res.status(403).json({ error: 'Acceso denegado. Solo los administradores pueden realizar esta acción.' });
  }
};

const isUser = (req, res, next) => {
  // Verificar si el usuario es un usuario normal
  if (req.session.user && req.session.user.role === 'user') {
    // Configurar req.user con la información del usuario almacenada en req.session.user
    req.user = req.session.user;
    // Permitir acceso si es un usuario normal
    next();
  } else {
    // Denegar acceso si no es un usuario normal
    res.status(403).json({ error: 'Acceso denegado. Solo los usuarios pueden realizar esta acción.' });
  }
};

const isPremium = (req, res, next) => {
  // Verificar si el usuario es un usuario premium
  if (req.session.user && req.session.user.role === 'premium') {
    // Configurar req.user con la información del usuario almacenada en req.session.user
    req.user = req.session.user;
    // Permitir acceso si es un usuario premium
    next();
  } else {
    // Denegar acceso si no es un usuario premium
    res.status(403).json({ error: 'Acceso denegado. Solo los usuarios premium pueden realizar esta acción.' });
  }
}

const isAdminOrPremium = (req, res, next) => {
  // Verificar si el usuario es un administrador o un usuario premium
  if (
    (req.session.user && req.session.user.role === 'admin') ||
    (req.session.user && req.session.user.role === 'premium')
  ) {
    // Configurar req.user con la información del usuario almacenada en req.session.user
    req.user = req.session.user;
    // Permitir acceso si es un administrador o un usuario premium
    next();
  } else {
    // Denegar acceso si no es un administrador o un usuario premium
    res.status(403).json({ error: 'Acceso denegado. Solo los administradores o usuarios premium pueden realizar esta acción.' });
  }
};

module.exports = { isAdmin, isUser, isPremium, isAdminOrPremium };
