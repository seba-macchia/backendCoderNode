const express = require('express');
const route = express.Router();
const userControllers = require('../controllers/userControllers');

route.get('/reset-password', userControllers.renderResetPassword);
route.post('/reset-password-email', userControllers.sendResetPasswordEmail);
route.get('/reset-password/:token', userControllers.renderNewPasswordForm);
route.post('/reset-password/:token', userControllers.resetPassword);
route.put('/premium/:uid', userControllers.toggleUserRole);
route.get('/all-users-emails', userControllers.getAllUserIdAndEmails);

module.exports = route;
