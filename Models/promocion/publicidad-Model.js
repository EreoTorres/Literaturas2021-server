const { formatoFechaInsert , getFilesBase64, deteleFiles, eliminarDiacriticos, eliminarEspacios } = require('../../herramientas/functionsGlobals');

module.exports = {
    getHistorialBannerCertificaciones: function (req) {
        return new Promise((resolve, reject) => {
            var query = 'SELECT '+
                'id,'+
                'titulo,'+
                'descripcion,'+
                'nombre_archivo,'+
                'IF(estatus = 1, "Activo", "Desactivado") as estatus,'+
                'DATE_FORMAT(fecha_modificacion,"%d/%m/%Y %H:%i:%s") as fecha_modificacion  '+
            'FROM escolar.tb_banner_certificaciones '+
            'ORDER BY fecha_modificacion DESC';

            connection.invokeQuery(query, function (results){
                 resolve(results)
            });
        });
    },
    setPublicidad: function (req){
        if(req.estatus == 'Activo'){
            req.estatus = 1;
        }else{
            req.estatus = 0;
        }

        var documento = req.nombre_archivo.split('.');
        req.extension = documento[1];

        if(req.base){
            req.nombre_archivo = eliminarDiacriticos(documento[0]);
            req.nombre_archivo = eliminarEspacios(req.nombre_archivo);
            req.nombre_archivo += '_'+new Date().getTime()+'.'+documento[1];
        }


        req.url_archivo = 'http://agcollege.edu.mx/literaturas/promociones/'+req.nombre_archivo;
        req.remotePath = '/var/www/html/literaturas/promociones/'+req.nombre_archivo;
        req.localPath = path.join(__dirname, '../../public/'+req.nombre_archivo);

        if(req.base){
            getFilesBase64(req.base,req.localPath);
        }

        return new Promise((resolve, reject) => {
            var query = `call escolar.sp_registro_promocion(`+
                req.id +`,'`+
                req.titulo +`','`+
                req.descripcion+`','`+
                formatoFechaInsert()+`','`+
                formatoFechaInsert()+`','`+
                req.url_archivo+`','`+
                req.nombre_archivo+`',`+
                req.estatus+`,`+
                req.id_usuario+
            `)`;
            
            connection.invokeQuery(query,async function (results){
                if(req.base){
                    await uploadFile(req,results[0]);
                    deteleFiles(req.localPath);
                    resolve(results[0])
                }else{
                    resolve(results[0])
                }
            });
        });
    }
};

function uploadFile(req) {
    return new Promise(async (resolve, reject) => {
        connectionSFTP.guardarDocumento(req, function (results){
            resolve(true);
        });
    });
}