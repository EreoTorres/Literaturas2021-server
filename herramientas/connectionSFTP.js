    global.sftp = new SFTPclient();

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


    sftp.connect(credencialesSFTP_produccion).then(async () => {
        return sftp.list('/var/www/html/literaturas');
    }).then(datos => {
       // console.log(datos)
        console.log('Client SFTP :: ready');
    }).catch(err => {
        console.log(err, 'catch error');
    });