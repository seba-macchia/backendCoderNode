const transporter = require('../config/email.config');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // Importación de la librería crypto
const fs = require('fs');
const Handlebars = require('handlebars');

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: 'El token de restablecimiento de contraseña no es válido o ha expirado' });
        }

        // Generar un nuevo token único
        const newResetToken = crypto.randomBytes(20).toString('hex');

        // Verificar si la nueva contraseña es igual a la anterior
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ message: 'No puedes utilizar la misma contraseña anterior' });
        }

        // Actualizar la contraseña y el token
        user.password = newPassword;
        user.resetPasswordToken = newResetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora de expiración
        await user.save();

        // Compile the Handlebars template
        const compiledTemplate = Handlebars.compile(fs.readFileSync('path_to_template.handlebars', 'utf8'));
        const resetUrl = `http://localhost:3000/reset-password/${newResetToken}`;
        
        // Render the template with data
        const html = compiledTemplate({ username: user.username, resetUrl });

        // Envío del correo electrónico de confirmación
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Contraseña restablecida con éxito',
            html: html,
        };

        transporter.sendMail(mailOptions, function(error, info) {
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
};

// Función para cambiar el rol de un usuario entre "user" y "premium"
async function toggleUserRole(req, res) {
    try {
        const { uid } = req.params;
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Cambiar el rol del usuario
        user.role = user.role === 'user' ? 'premium' : 'user';
        await user.save();

        res.status(200).json({ message: 'Rol de usuario actualizado correctamente', user });
    } catch (error) {
        console.error('Error al cambiar el rol de usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = {
    resetPassword,
    toggleUserRole,
};
