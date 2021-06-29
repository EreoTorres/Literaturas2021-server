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

    filesModel.setFiles(registro, res).then(function(result) {
        if (result) {
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