const { eliminarDiacriticos, eliminarEspacios } = require('../../herramientas/functionsGlobals');

module.exports = {
    setFiles: function(registro) {
        return new Promise(async(resolve, reject) => {
            var file = [];

            registro.files.forEach(async function(f, index) {
                file.push(await sendFile(f, res, index).then(url => {
                    return url
                }));

                if (index + 1 == files.length) {
                    resolve(file)
                }
            })
        });
    },
};

async function sendFile(file, res, index) {
    return new Promise(async(resolve, reject) => {
        var fileStream = await convertFile(file, index);

        const params = {
            Bucket: bucket,
            Key: fileStream.nombre,
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
            console.log(fileStream.url)
            resolve(fileStream)
        });
    })
}

function convertFile(file, index) {
    return new Promise((resolve, reject) => {

        var datetime = new Date().getTime();
        var formato = file.originalname.split(".")
        var nombre = datetime + '-' + index + '-' + formato[0] + '.' + formato[1];

        fs.rename(file.path, path.join(__dirname, "../public/" + nombre), err => {
            if (err) {
                console.log(err)
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