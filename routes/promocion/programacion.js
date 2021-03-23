var express = require('express');
var router = express.Router({ mergeParams: true });
var programacionModel =  require('../../Models/promocion/programacion-Model.js');

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/getProgramacion',function(req, res, next) {
    programacionModel.getProgramacion(req.body).then(function(results) {
        if(results.length > 0){
            res.setHeader("Content-Type", "application/json");
            res.json({codigo: 200,resultado: results});
            res.end();    
        }else{
            res.setHeader("Content-Type", "application/json");
            res.json({codigo: 0,mensaje: "No se encontraron programaciones"});
            res.end(); 
        }
    }).catch((err) => console.log(err));
});


router.post('/setProgramacion',function(req, res, next) {
    programacionModel.setProgramacion(req.body).then(function(results) {
        console.log(results)
        if(results.length > 0){
            res.setHeader("Content-Type", "application/json");
            res.json({codigo: 200,resultado: results});
            res.end();    
        }else{
            res.setHeader("Content-Type", "application/json");
            res.json({codigo: 0,mensaje: "Problemas al guardar la programacion"});
            res.end(); 
        }
    }).catch((err) => console.log(err));
});

module.exports = router;
