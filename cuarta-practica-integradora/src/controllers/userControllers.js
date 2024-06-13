const transporter = require('../config/email.config');
const User = require('../models/user.model');
const UserManager = require('../services/userService');
const userManager = new UserManager();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fs = require('fs');
const Handlebars = require('handlebars');
const path = require('path');

// Enviar correo de restablecimiento de contraseña
async function sendResetPasswordEmail(req, res) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // Si el usuario no es encontrado, enviar una respuesta JSON con un mensaje adecuado
            return res.status(400).json({ userNotFound: true });
        }

        // Generar un token único
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora de expiración
        await user.save();

        // Compile the Handlebars template
        const templateSource = fs.readFileSync('./src/views/resetPasswordEmail.handlebars', 'utf8');
        const compiledTemplate = Handlebars.compile(templateSource);
        const resetUrl = `http://localhost:8080/api/users/reset-password/${resetToken}`;

        // Render the template with data
        const html = compiledTemplate({ username: user.username, resetUrl });

        // Enviar el correo electrónico de restablecimiento de contraseña
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Restablecimiento de contraseña',
            html: html,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Error al enviar el correo electrónico de restablecimiento de contraseña' });
            } else {
                console.log('Correo electrónico de restablecimiento de contraseña enviado');
                return res.status(200).json({ message: 'Correo electrónico de restablecimiento de contraseña enviado' });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}


// Renderizar la vista para ingresar nueva contraseña
async function renderNewPasswordForm(req, res) {
    const { token } = req.params;
    res.render('newPassword', { token });
}

// Restablecer la contraseña
async function resetPassword(req, res) {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        // Buscar el usuario con el token proporcionado
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) {
            // Si no se encuentra un usuario con el token válido, enviar una respuesta JSON
            return res.status(400).json({ expiredToken: true });
        }

        // Verificar si la nueva contraseña es igual a la anterior
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ message: 'No puedes utilizar la misma contraseña anterior' });
        }

        // Generar un nuevo token único
        const newResetToken = crypto.randomBytes(20).toString('hex');

        // Actualizar la contraseña, el token y la expiración
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = newResetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora de expiración
        await user.save();

        res.status(200).json({ message: 'Contraseña restablecida con éxito' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}

async function renderResetPassword(req, res) {
    res.render('resetPassword');
}

// Función para subir documentos
async function uploadDocuments(req, res) {
  try {
    const { uid } = req.params;
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No se han subido archivos' });
    }

    // Manejar los archivos subidos
    ['profileImage', 'productImage', 'documents'].forEach(field => {
      if (req.files[field]) {
        req.files[field].forEach(file => {
          // Verificar si el documento ya existe en el usuario
          const documentExists = user.documents.some(doc => doc.name === file.originalname);
          if (!documentExists) {
            user.documents.push({
              name: file.originalname,
              reference: path.relative(path.join(__dirname, '../../uploads'), file.path)
            });
          }
        });
      }
    });

    await user.save();
    res.status(200).json({ message: 'Documentos subidos correctamente', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}



// Función para cambiar el rol de un usuario entre "user" y "premium"
async function toggleUserRole(req, res) {
  try {
    const { uid } = req.params;
    const user = await User.findById(uid);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Función para normalizar nombres de archivos
    const normalizeFileName = (fileName) => {
      const noNumberFileName = fileName.replace(/^\d+-/, "");
      return noNumberFileName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9\.]/g, "_")
        .toLowerCase();
    };

    // Verificar si el usuario ha subido todos los documentos requeridos
    const requiredDocuments = ['identificacion', 'comprobante_de_domicilio', 'comprobante_de_estado_de_cuenta'];
    const uploadedDocuments = user.documents.map(doc => normalizeFileName(doc.name));

    // Compara los nombres de los documentos subidos (normalizados) con los nombres requeridos (normalizados)
    const hasAllDocuments = requiredDocuments.every(doc => uploadedDocuments.includes(doc));

    if (!hasAllDocuments) {
      return res.status(400).json({ error: 'El usuario no ha terminado de procesar su documentación' });
    }

    // Cambiar el rol del usuario a "premium"
    user.role = 'premium';
    await user.save();

    res.status(200).json({ message: 'Rol de usuario actualizado correctamente', user });
  } catch (error) {
    console.error('Error al cambiar el rol de usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function getAllUserIdAndEmails(req, res) {
    try {
        const users = await userManager.getAllUserIdAndEmails();
        if (!users) {
            return res.status(404).json({ message: 'No se encontraron usuarios' });
        }
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}


module.exports = {
    sendResetPasswordEmail,
    resetPassword,
    renderResetPassword,
    renderNewPasswordForm,
    toggleUserRole,
    getAllUserIdAndEmails,
    uploadDocuments
};
