    global.connectionSFTP = module.exports = function(){};

    global.credencialesSFTP_pruebas = {
        host: '164.90.144.135',
        port: '',
        username: 'root',
        password: 'Ijakj5389JHkjcL'
    };

    global.credencialesSFTP_produccion = {
        host: 'agcollege.edu.mx',
        port: '',
        username: 'literaturas',
        password: 'AJlajskjso3%'
    };

    connectionSFTP.guardarDocumento = function (rutas, resolve){
        global.sftp = new SFTPclient();

        sftp.connect(credencialesSFTP_produccion)
        .then(() => {
            return sftp.fastPut(rutas.localPath,rutas.remotePath);
        })
        .then(data => {
            sftp.end();
            return data;
        })
        .then((data) => {
            console.log(data + ':::fastPut');
            resolve(data);
        })
        .catch(err => {
            console.log(err, 'catch error - guardarDocumento');
            sftp.end();
            //resolve(err);
        });
    }

    connectionSFTP.fastGet = function (rutas, resolve){
        global.sftp = new SFTPclient();

        sftp.connect(credencialesSFTP_produccion)
        .then(() => {
            return sftp.fastGet(rutas.remotePath,rutas.localPath);
        })
        .then(data => {
            sftp.end();
            return data;
        })
        .then((data) => {
            console.log(data + ':::fastGet');
            resolve(data);
        })
        .catch(err => {
            console.log(err, 'catch error - guardarDocumento');
            sftp.end();
            resolve(err);
        });
    }

    connectionSFTP.mkdir = function (remotePath, resolve){
        global.sftp = new SFTPclient();

        sftp.connect(credencialesSFTP_produccion)
        .then(() => {
            return sftp.mkdir(remotePath, true);
        })
        .then(data => {
            sftp.end();
            return data;
        })
        .then((data) => {
            console.log(data + ':::mkdir');
            resolve(data);
        })
        .catch(err => {
            sftp.end();
            resolve(err);
            console.log(err + ':::mkdir-error');
            //console.log(err, 'catch error - guardarDocumento');
        });
    }
