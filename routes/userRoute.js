const express = require('express');
const UserRoute = express.Router()
const { myProfile, getAllUsers, getSingleUser, updateUser} = require('../controllers/userController');
const { authentication, authorization } = require('../middlewares/authentication')

UserRoute.route('/').get(authentication, myProfile)
UserRoute.route('/all-users').get(authentication, authorization, getAllUsers)
UserRoute.route('/:id').patch(authentication, authorization, updateUser)
UserRoute.route('/:id').get(authentication, authorization, getSingleUser)


module.exports = UserRoute