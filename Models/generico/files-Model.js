const { getCredencialesAWSS3 } = require('../../herramientas/functionsGlobals');

module.exports = {
    setFiles: function(registro, res) {
        return new Promise(async(resolve, reject) => {
            var file = [];

            registro.files.forEach(async function(f, index) {
                file.push(await sendFile(f, registro.datos, res, index).then(url => {
                    return url
                }));

                if (index + 1 == registro.files.length) {
                    resolve(file)
                }
            })
        });
    },
};

async function sendFile(file, datos, res, index) {
    return new Promise(async(resolve, reject) => {
        var fileStream = await convertFile(file, res, index);
        var credenciales = getCredencialesAWSS3(datos.credencial_id);

        if (credenciales) {
            const params = {
                Bucket: credenciales.bucket,
                Key: datos.ruta + "_" + fileStream.nombre,
                Body: fileStream.stream
            };

            var s3 = new aws.S3();
            s3.upload(params, function(err, data) {
                if (err) {
                    res.setHeader("Content-Type", "application/json");
                    res.json({ codigo: 0, mensaje: 'Problemas al subir el archivo. Intentalo nuevamente.' });
                    res.end();
                }

                fs.unlinkSync(fileStream.urlTemp)
                fileStream.url = data.Location;

                resolve(fileStream)
            });
        } else {
            res.setHeader("Content-Type", "application/json");
            res.json({ codigo: 0, mensaje: 'Credenciales no definidas.' });
            res.end();
        }
    })
}

function convertFile(file, res, index) {
    return new Promise((resolve, reject) => {
        var datetime = new Date().getTime();
        var formato = file.originalname.split(".")
        var nombre = datetime + '_' + index + '.' + formato[1];

        var targetPath = path.join(__dirname, "../../public/" + nombre);

        fs.rename(file.path, targetPath, err => {
            if (err) {
                res.setHeader("Content-Type", "application/json");
                res.json({ codigo: 0, mensaje: err });
                res.end();
            } else {
                resolve({
                    stream: fs.createReadStream(targetPath),
                    urlTemp: targetPath,
                    nombre: nombre,
                    formato: formato[1],
                    tipo: file.mimetype
                });
            }
        });
    })
}