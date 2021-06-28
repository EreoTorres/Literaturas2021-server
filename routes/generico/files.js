var express = require('express');
var filesModel = require('../../Models/generico/files-Model');
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
    res.setHeader("Content-Type", "application/json");
    res.json({ codigo: 200, resultado: registro });
    res.end();

    /*filesModel.setFiles(registro).then(function(result) {
        if (result) {
            for (let datos of result) {
                if (datos.encontrado != 1 && datos.localPath) {
                    console.log(datos.localPath)
                    if (fs.existsSync(datos.localPath)) {
                        fs.unlinkSync(datos.localPath);
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
    });*/
});

router.get('/streamdoc/:id_plan/:id_materia/:nombre_archivo', async function(req, res) {

    literaturasModel.getDocLiteratura(req.params).then(function(result) {
        console.log(result)
        let localPath = path.join(__dirname, '../../public/' + req.params.nombre_archivo);
        if (result) {
            res.download(localPath, function(err) {
                if (err) {
                    console.log(err); // Check error if you want
                }
                fs.unlinkSync(localPath);
            });
        } else {
            res.setHeader("Content-Type", "application/json");
            res.json({ codigo: 0, mensaje: 'El documento no existe.' });
            res.end();
        }
    });
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

                resolve(registro)
            }
        });
    });
}

module.exports = router;