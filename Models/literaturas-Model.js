const { eliminarDiacriticos,eliminarEspacios } = require('../herramientas/functionsGlobals');

module.exports = {
    getLiteraturas: function (req) {
        var filtro = '';

        if(req.tipofiltro == 1){
            filtro = ' and a.nombre_archivo like "%'+req.filtro+'%" ';
        }

        if(req.tipofiltro == 2 && req.filtro.id_plan_estudio > 0){
            filtro = ' and a.id_plan_estudio = "'+req.filtro.id_plan_estudio+'" ';

            if(req.filtro.id_moodle > 0){
                filtro += ' and a.idmoodle_materia = "'+req.filtro.id_moodle+'" ';
            } 
        }

        if(req.tipofiltro == 3){
            filtro = ' and a.fecha_modificacion >= "'+req.filtro+' 00:00:00"'+
            ' and a.fecha_modificacion <= "'+req.filtro+' 23:59:59"';
        }

        return new Promise((resolve, reject) => {
            var query = 'SELECT ' +
                'a.id,'+
                'a.nombre_archivo,'+
                'a.nombre_original,'+
                'a.ruta_publica,'+
                //'a.fecha_modificacion,'+
                'DATE_FORMAT(a.fecha_modificacion, "%d/%m/%Y %H:%i:%s") as "fecha_modificacion",'+
                'c.nombre_corto as "nombre_plan_estudio",'+
                'e.nombre as "nombre_materia", '+
                'a.id_plan_estudio, '+
                'a.idmoodle_materia '+
            'FROM ' +
                'escolar.tb_materiales_estudio_archivos a '+
            'INNER JOIN '+
                'escolar.tb_plan_estudio c ON  c.id = a.id_plan_estudio '+
            'INNER JOIN '+
                'escolar.tb_materias_ids d ON d.id_moodle = a.idmoodle_materia '+
            'INNER JOIN '+
                'escolar.tb_materias e ON e.id = d.id_materia '+
            'WHERE ' +
                'e.activo = 1 '+
                'and d.id_plan_estudio = a.id_plan_estudio '+
            filtro+
            ' ORDER BY a.fecha_modificacion DESC';

            connection.invokeQuery(query, function (results){
                 resolve(results)
            });
        });
    },
    getProgramasAcademicos: function (registro) {
        var query = 'SELECT '+
            'DISTINCT c.id,'+
            'c.nombre_corto '+
        'FROM '+
            'escolar.tb_corporaciones a '+
            'INNER JOIN escolar.tb_escuelas b ON b.id_corporacion = a.id '+
            'INNER JOIN escolar.tb_plan_estudio c ON c.id_escuela = b.id '+
        'WHERE '+
            'c.inscripcion = 1 '+
            'AND c.activo = 1 '+
        'ORDER BY '+
            'a.id,c.nombre_corto ';

        return new Promise((resolve, reject) => {
            connection.invokeQuery(query, function (results){
                resolve(results);
            })
        });
    },
    getMaterias: function (plan_estudio) {
        return new Promise((resolve, reject) => {
            var query = 'SELECT '+
                'b.id_moodle, '+
                'a.nombre, '+
                'b.id_plan_estudio, '+
                'a.periodo '+
            'FROM '+
                'escolar.tb_materias a '+
                'INNER JOIN escolar.tb_materias_ids b ON b.id_materia = a.id '+
            'WHERE '+
                'a.activo = 1 '+
                'AND b.id_plan_estudio =  '+ plan_estudio.id+
            ' ORDER BY '+
                'a.periodo,a.nombre';

            connection.invokeQuery(query, function (results){
                resolve(results);
            });
        });
    },
    getDocLiteratura: function (file) {
        return new Promise((resolve, reject) => {
            let remotePath = '/var/www/html/literaturas/'+file.id_plan+'/'+file.id_materia+'/'+file.nombre_archivo;
            let localPath = path.join(__dirname, '../public/'+file.nombre_archivo);

            resolve(sftp.fastGet(remotePath, localPath));
        });
    },
    setLiteraturas: function (registro) {
        return new Promise(async (resolve, reject) => {
            var datos = registro.datos;
            var resultados = [];
        
            for(let file of registro.files){
                file.namenew = eliminarDiacriticos(file.originalname);
                file.namenew = eliminarEspacios(file.namenew);

                var res = await buscarLiteratura({
                    id_plan_estudio: datos.id_plan_estudio,
                    id_moodle: datos.id_moodle,
                    originalname: file.originalname
                });

                file.localPath = file.destination+'\\'+file.namenew;
                file.remotePath = '/var/www/html/literaturas/'+datos.id_plan_estudio+'/'+ datos.id_moodle;

                if(res.length == 0){
                    fs.renameSync(file.path,file.localPath);
    
                    try {
                        await sftp.mkdir(file.remotePath, true);
                    }catch(e) {
                        console.error(e.message);
                    };
                    
                    res = await addLiteraturas(datos,file);
                    res.localPath = file.localPath
                }else{
                    res = res[0];
                    fs.unlinkSync(file.path);
                }

                resultados.push(res);
            }

            resolve(resultados);
        });
    },
};

function addLiteraturas(datos,file){
    return new Promise(async (resolve, reject) => {
        file.namenew = eliminarDiacriticos(file.originalname);
        file.namenew = eliminarEspacios(file.namenew);

        var registros = [
            0,
            file.namenew,
            file.originalname,
            file.remotePath,
            'http://agcollege.edu.mx/literaturas/'+
                datos.id_plan_estudio+'/'+ datos.id_moodle+'/'+file.namenew,
            datos.id_plan_estudio,
            datos.id_moodle,
            datos.id_usuario,
            datos.id_usuario
        ]

        var query = 'call escolar.sp_registrar_materiales_estudio('+
            '0,"'+
            file.namenew+'","'+
            file.originalname+'","'+
            file.remotePath+'","'+
            'http://agcollege.edu.mx/literaturas/'+
                datos.id_plan_estudio+'/'+ datos.id_moodle+'/'+file.namenew+'",'+
            datos.id_plan_estudio+','+
            datos.id_moodle+','+
            datos.id_usuario+','+
            datos.id_usuario+
        ')';
        
        if(await uploadFile(registros,file)){
            connection.invokeQuery(query, function (results){
                resolve(results[0][0]);
            });
        }
    });
}

function uploadFile(registros,file) {
    return new Promise(async (resolve, reject) => {
        
        try {
            await sftp.fastPut(file.localPath,file.remotePath+'/'+registros[1]);
        }catch(e) {
            console.error(e.message);
        };

        resolve(true);
    });
}

function buscarLiteratura(datos){
    return new Promise(async (resolve, reject) => {
        var query = 'SELECT ' +
            'a.id,'+
            'a.nombre_original,'+
            'a.ruta_publica,'+
            'DATE_FORMAT(a.fecha_modificacion, "%d/%m/%Y %H:%i:%s") as "fecha_modificacion",'+
            'c.nombre as "nombre_plan_estudio",'+
            'e.nombre as "nombre_materia", '+
            'a.id_plan_estudio, '+
            'a.idmoodle_materia, '+
            '"1"  as "encontrado" '+
        'FROM ' +
            'escolar.tb_materiales_estudio_archivos a '+
        'INNER JOIN '+
            'escolar.tb_plan_estudio c ON  c.id = a.id_plan_estudio '+
        'INNER JOIN '+
            'escolar.tb_materias_ids d ON d.id_moodle = a.idmoodle_materia '+
        'INNER JOIN '+
            'escolar.tb_materias e ON e.id = d.id_materia '+
        'WHERE ' +
            'e.activo = 1 '+
            ' and d.id_plan_estudio = a.id_plan_estudio '+
            ' and a.id_plan_estudio = '+datos.id_plan_estudio+
            ' and a.idmoodle_materia = '+datos.id_moodle+
            ' and a.nombre_original = "'+datos.originalname+'"'+
        ' ORDER BY a.fecha_modificacion DESC';

        connection.invokeQuery(query, function (results){
            resolve(results)
        });
    });
}