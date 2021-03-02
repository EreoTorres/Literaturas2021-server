var globalF = require('../herramientas/functionsGlobals');

module.exports = {
    getVideos: function (req) {
        var filtro = '';

        if(req.tipofiltro == 1){
            filtro = ' and a.titulo_video like "%'+req.filtro+'%" ';
        }

        if(req.tipofiltro == 2 && req.filtro > 0){
            filtro = ' and a.id_plan_estudio = "'+req.filtro+'" ';
        }

        if(req.tipofiltro == 3){
            filtro = ' and a.fecha_mod >= "'+req.filtro+' 00:00:00"'+
            ' and a.fecha_mod <= "'+req.filtro+' 23:59:59"';
        }

        return new Promise((resolve, reject) => {
            var query = 'SELECT ' +
                'a.id,'+
                'a.titulo_video,'+
                'a.descripcion,'+
                'a.url_video,'+
                //'a.fecha_modificacion,'+
                'DATE_FORMAT(a.fecha_mod, "%d/%m/%Y %H:%i:%s") as "fecha_modificacion",'+
                'c.nombre_corto as "nombre_plan_estudio",'+
                'a.id_plan_estudio '+
            'FROM ' +
                'escolar.tb_videos_plataforma a '+
            'INNER JOIN '+
                'escolar.tb_plan_estudio c ON  c.id = a.id_plan_estudio '+
            'WHERE ' +
                'a.estatus = "A" '+
            filtro+
            ' ORDER BY a.fecha_mod DESC';

            connection.invokeQuery(query, function (results){
                 resolve(results)
            });
        });
    },
    setVideos: function (req){
        return new Promise((resolve, reject) => {
            var query = `call escolar.sp_registrar_videos_plataforma(`+
                `0,`+
                req.id_plan_estudio +`,'`+
                req.titulo_video+`','`+
                req.descripcion+`',`+
                `'','`+//tags
                globalF.mysql_real_escape_string(req.url_video)+`','`+
                globalF.mysql_real_escape_string(req.html_iframe)+`','`+
                req.servicio+`',`+
                req.id_usuario+
            `)`;

            connection.invokeQuery(query, function (results){
                 resolve(results[0])
            });
        });
    }
};