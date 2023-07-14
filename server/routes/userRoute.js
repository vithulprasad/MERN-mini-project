const express = require('express');
const user_route = express()
const userController = require('../controller/userController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/profileImages'));
    },
    filename: function (req, file, cb) {
      const name = Date.now() + '-' + file.originalname;
      cb(null, name);
    },
  });
  
  const upload = multer({ storage: storage });



user_route.post('/register',userController.Register);
user_route.post('/login',userController.login);
user_route.get('/profile',userController.profile);
user_route.get('/edit',userController.edit);
user_route.post('/editProfile',upload.single('image'),userController.editValue);
module.exports = user_route;
