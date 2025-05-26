const express = require('express');
const AuthRoute = express.Router()
const { signup, login, logout, forgotPassword, resetPassword, verifyAccount} = require('../controllers/authController');
const { authentication, authorization } = require('../middlewares/authentication')

AuthRoute.route('/signup').post(signup)
AuthRoute.route('/verify-account').patch(verifyAccount)
AuthRoute.route('/login').post(login)
AuthRoute.route('/logout').post(authentication, logout)
AuthRoute.route('/forgot-password').post(forgotPassword)
AuthRoute.route('/reset-password').patch(resetPassword)

module.exports = AuthRoute