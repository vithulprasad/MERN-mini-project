const express = require ('express');
const adminController = require('../controller/adminController');
const admin_route = express();

admin_route.post('/login',adminController.login);
admin_route.get('/getUser',adminController.getUser)
admin_route.get('/blokeUser',adminController.blokeUser)
admin_route.get('/spelingFind',adminController.spelingFind)
module.exports = admin_route;