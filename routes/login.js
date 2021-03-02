var express = require('express');
var router = express.Router({ mergeParams: true });
var loginModel =  require('../Models/login-Model.js');

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/login',function(req, res, next) {
    loginModel.login(req.body).then(function(results) {
        if(results.length > 0){
            res.setHeader("Content-Type", "application/json");
            res.json({codigo: 200,resultado: results});
            res.end();    
        }else{
            res.setHeader("Content-Type", "application/json");
            res.json({codigo: 0,mensaje: "Contraseña o Usuario incorrectos"});
            res.end(); 
        }
    }).catch((err) => console.log(err));
});

module.exports = router;
