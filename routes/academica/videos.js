var express = require('express');
var router = express.Router({ mergeParams: true });
var videosModel =  require('../../Models/academica/videos-Model.js');

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/getVideos',function(req, res, next) {
    videosModel.getVideos(req.body).then(function(results) {
        if(results.length > 0){
            res.setHeader("Content-Type", "application/json");
            res.json({codigo: 200,resultado: results});
            res.end();    
        }else{
            res.setHeader("Content-Type", "application/json");
            res.json({codigo: 0,mensaje: "No se encontraron videos"});
            res.end(); 
        }
    }).catch((err) => console.log(err));
});

router.post('/setVideos',function(req, res, next) {
    videosModel.setVideos(req.body).then(function(results) {
        if(results.length > 0){
            res.setHeader("Content-Type", "application/json");
            res.json({codigo: 200,resultado: results});
            res.end();    
        }else{
            res.setHeader("Content-Type", "application/json");
            res.json({codigo: 0,mensaje: "No se encontraron videos"});
            res.end(); 
        }
    }).catch((err) => console.log(err));
});

module.exports = router;
