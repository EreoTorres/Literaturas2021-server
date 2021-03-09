var globalF = require('../herramientas/functionsGlobals');

module.exports = {
    getProgramacion: function (req) {
        return new Promise((resolve, reject) => {
            var query = 'SELECT ' +
                'a.id as id_programacion,'+
                'DATE_FORMAT(a.fecha_programada,"%d/%m/%Y") as fecha_programada,'+
                'a.hora,'+
                'a.maximo_asistentes,'+
                'IF(estatus = 1, "Activo", "Desactivado") as estatus,'+
                'b.nombre_corto as nombre_plan_estudio '+
            'FROM '+
                'escolar.tb_promocion_programaciones a '+
            'INNER JOIN '+
                'escolar.tb_plan_estudio b ON a.id_plan_estudio = b.id '+
            ' ORDER BY a.fecha_modifica DESC';

            connection.invokeQuery(query, function (results){
                 resolve(results)
            });
        });
    },
    setProgramacion: function (req){
        if(req.estatus == 'Activo'){
            req.estatus = 1;
        }else{
            req.estatus = 0;
        }

        return new Promise((resolve, reject) => {
            var query = `call escolar.sp_registro_programacion(`+
                req.id_programacion +`,`+
                req.id_plan_estudio +`,`+
                `'','`+
                req.fecha_programada_f+`','`+
                req.hora+`',`+
                req.maximo_asistentes+`,`+
                req.estatus+`,`+
                req.id_usuario+
            `)`;
            
            connection.invokeQuery(query, function (results){
                 resolve(results[0])
            });
        });
    }
};