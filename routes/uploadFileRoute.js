const express = require('express');
const FileUploadRoute = express.Router()
const {uploadFile} = require('../controllers/uploadFileController');

FileUploadRoute.route('/').post(uploadFile)

module.exports = FileUploadRoute