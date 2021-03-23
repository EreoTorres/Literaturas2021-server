var express = require('express');
var publicidadModel = require('../../Models/promocion/publicidad-Model');
var globalF = require('../../herramientas/functionsGlobals');
var router = express.Router({ mergeParams: true });
var storage = multer.diskStorage({
    destination: path.join(__dirname, "../public")
});
var upload = multer({ storage : storage}).any();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/getHistorialBannerCertificaciones',async function(req, res, next) {
    publicidadModel.getHistorialBannerCertificaciones(req.body).then(function (result){
        if(result){
            res.setHeader("Content-Type", "application/json");
            res.json({codigo: 200,resultado: result});
            res.end(); 
        }else{
            res.setHeader("Content-Type", "application/json");
            res.json({codigo: 0,mensaje: 'No se encontraron literaturas.'});
            res.end(); 
        }   
    });
});

router.post("/setPublicidad",async function (req, res){
    //await globalF.getFilesBase64(req.body.base,req.body.extension);

    publicidadModel.setPublicidad(req.body).then(function (result){
        if(result){
            res.setHeader("Content-Type", "application/json");
            res.json({codigo: 200,resultado: result});
            res.end(); 
        }else{
            res.setHeader("Content-Type", "application/json");
            res.json({codigo: 0,mensaje: 'No se encontraron literaturas.'});
            res.end(); 
        }   
    });
});

module.exports = router;
