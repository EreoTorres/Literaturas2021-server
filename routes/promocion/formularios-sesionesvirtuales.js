var express = require('express');
var router = express.Router({ mergeParams: true });
var formulario_sesionesvirtualesModel =  require('../../Models/promocion/formularios-sesionesvirtuales-Model');

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/getFormularios',function(req, res, next) {
    formulario_sesionesvirtualesModel.getFormularios().then(function(results) {
        if(results.length > 0){
            res.setHeader("Content-Type", "application/json");
            res.json({codigo: 200,resultado: results});
            res.end();    
        }else{
            res.setHeader("Content-Type", "application/json");
            res.json({codigo: 0,mensaje: "No se encontraron formularios"});
            res.end(); 
        }
    }).catch((err) => console.log(err));
});


router.post('/setFormulario',function(req, res, next) {
    formulario_sesionesvirtualesModel.setFormulario(req.body).then(function(results) {
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
