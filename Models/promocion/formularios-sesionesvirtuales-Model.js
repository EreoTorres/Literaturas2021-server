module.exports = {
    getFormularios: function (req) {
        return new Promise((resolve, reject) => {
            var query = `SELECT
                    a.id,
                    DATE_FORMAT(a.fecha_modificacion,"%d/%m/%Y %H:%i") as fecha_modificacion,
                    IF(estatus = 1, "Activo", "Desactivado") as estatus,
                    b.nombre_corto as nombre_plan_estudio, 
                    d.nombre as corporacion
                FROM 
                    escolar.tb_formularios_sesionesvirtuales a 
                INNER JOIN 
                    escolar.tb_plan_estudio b ON b.id = a.id_plan_estudio
                INNER JOIN 
                    tb_corporaciones d ON d.id = a.id_corporacion 
                ORDER BY a.fecha_modificacion DESC`;

            connection.invokeQuery(query, function (results){
                 resolve(results)
            });
        });
    },
    setFormulario: function (req){
        if(req.estatus == 'Activo'){
            req.estatus = 1;
        }else{
            req.estatus = 0;
        }

        return new Promise((resolve, reject) => {
            var query = `call escolar.sp_formulario_sesionesvirtuales(
                ${req.id},
                ${req.id_plan_estudio},
                ${req.id_corporacion},
                ${req.estatus},
                ${req.id_usuario}
            )`;
            
            connection.invokeQuery(query, function (results){
                 resolve(results[0])
            });
        });
    }
};