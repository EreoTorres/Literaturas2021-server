var express = require('express');
var filesModel = require('../../Models/generico/files-Model');
const { getCredencialesAWSS3 } = require('../../herramientas/functionsGlobals');

var router = express.Router({ mergeParams: true });
var storage = multer.diskStorage({
    destination: path.join(__dirname, "../../public")
});
var upload = multer({ storage: storage }).any();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post("/setFiles", async function(req, res) {
    var registro = await getFiles(req, res);

    filesModel.setFiles(registro, res).then(function(result) {
        if (result) {
            for (let datos of result) {
                if (datos.urlTemp) {
                    if (fs.existsSync(datos.urlTemp)) {
                        fs.unlinkSync(datos.urlTemp);
                        console.log("El archivo EXISTE!");
                    } else {
                        console.log("El archivo NO EXISTE!");
                    }
                }
            }

            res.setHeader("Content-Type", "application/json");
            res.json({ codigo: 200, resultado: result });
            res.end();
        } else {
            res.setHeader("Content-Type", "application/json");
            res.json({ codigo: 0, mensaje: 'No se encontraron literaturas.' });
            res.end();
        }
    });
});


router.get('/getfile/:credencial_id/:nombre', async function(req, res) {
    var credenciales = getCredencialesAWSS3(req.params.credencial_id);

    if (credenciales) {
        const params = {
            Bucket: credenciales.bucket,
            Key: 'pagos/' + req.params.nombre
        };

        new aws.S3().getObject(
            params,
            function(err, data) {
                if (!err) {
                    fs.writeFile('public/' + req.params.nombre, data.Body, 'binary', function(err) {
                        if (err) {
                            res.setHeader("Content-Type", "application/json");
                            res.json({ codigo: 0, mensaje: "No se encontro el documento" });
                            res.end();
                        } else {
                            var stat = fs.statSync('public/' + req.params.nombre);
                            var contentType = mime.lookup('public/' + req.params.nombre);

                            res.writeHead(200, {
                                'Content-Type': contentType,
                                'Content-Length': stat.size
                            });
                            fs.createReadStream('public/' + req.params.nombre).pipe(res);

                            req.on('close', () => {
                                if (fs.existsSync('public/' + req.params.nombre)) {
                                    fs.unlinkSync('public/' + req.params.nombre);
                                    console.log("El archivo EXISTE!");
                                }

                                console.log("se cerro la pagina");
                            });
                        }
                    });
                } else {
                    res.setHeader("Content-Type", "application/json");
                    res.json({ codigo: 0, mensaje: err });
                    res.end();
                }
            }
        );
    } else {

        res.setHeader("Content-Type", "application/json");
        res.json({ codigo: 0, mensaje: "Credenciales no definidas." });
        res.end();
    }
});

router.get('/downloadfile/:credencial_id/:nombre', async function(req, res) {
    var credenciales = getCredencialesAWSS3(req.params.credencial_id);

    if (credenciales) {
        const params = {
            Bucket: credenciales.bucket,
            Key: 'pagos/' + req.params.nombre
        };

        new aws.S3().getObject(
            params,
            function(err, data) {
                if (!err) {
                    fs.writeFile('public/' + req.params.nombre, data.Body, 'binary', function(err) {
                        if (err) {
                            res.setHeader("Content-Type", "application/json");
                            res.json({ codigo: 0, mensaje: "No se encontro el documento" });
                            res.end();
                        } else {
                            res.download('public/' + req.params.nombre, function(err) {
                                if (err) {
                                    console.log(err); // Check error if you want
                                }
                                fs.unlinkSync('public/' + req.params.nombre);
                            });
                        }
                    });
                } else {
                    res.setHeader("Content-Type", "application/json");
                    res.json({ codigo: 0, mensaje: err });
                    res.end();
                }
            }
        );
    } else {

        res.setHeader("Content-Type", "application/json");
        res.json({ codigo: 0, mensaje: "Credenciales no definidas." });
        res.end();
    }
});


function getFiles(req, res) {
    return new Promise((resolve, reject) => {
        upload(req, res, function(err) {
            if (err) {
                res.setHeader("Content-Type", "application/json");
                res.json({ codigo: 0, mensaje: "Error uploading file." });
                res.end();
            } else {
                var registro = { datos: null, files: [] };

                req.files.forEach(async function(f) {
                    if (f.fieldname == "data") {
                        registro.datos = JSON.parse(fs.readFileSync(f.path, 'utf8'));
                        fs.unlinkSync(f.path);
                    } else {
                        registro.files.push(f)
                    }
                });

                if (req.body && !registro.datos) {
                    registro.datos = JSON.parse(req.body.data);
                }

                resolve(registro)
            }
        });
    });
}

module.exports = router;