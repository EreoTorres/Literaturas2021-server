const { eliminarDiacriticos, eliminarEspacios } = require('../../herramientas/functionsGlobals');

module.exports = {
    setFiles: function(registro) {
        return new Promise(async(resolve, reject) => {
            var resultados_urls = [];

            registro.files.forEach(async function(f, index) {
                resultados_urls.push(await sendFile(f, insertId, res, index).then(url => {
                    return url
                }));

                if (index + 1 == files.length) {
                    resolve(resultados_urls);
                }
            })
        });
    },
};

async function sendFile(file, idregistro, res, index) {
    return new Promise(async(resolve, reject) => {
        var fileStream = await convertFile(file, idregistro, index);

        const params = {
            Bucket: bucket,
            Key: ambiente + '/' + fileStream.carpeta + '/' + fileStream.nombre,
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

function convertFile(file, idregistro, index) {
    return new Promise((resolve, reject) => {

        var datetime = new Date().getTime();
        var formato = file.originalname.split(".")
        var nombre = datetime + '-' + index + '-' + idregistro + '.' + formato[1];
        var carpeta = functionsGlobals.getCarpeta(file.mimetype);

        const tempPath = file.path;
        const targetPath = path.join(__dirname, "../public/" + nombre);

        fs.rename(tempPath, targetPath, err => {
            if (err) {
                console.log(err)
            } else {
                resolve({
                    stream: fs.createReadStream(targetPath),
                    urlTemp: targetPath,
                    carpeta: carpeta,
                    nombre: nombre,
                    formato: formato[1],
                    tipo: file.mimetype
                });
            }
        });
    })
}