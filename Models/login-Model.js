module.exports = {
    login: function (usuario) {
        return new Promise((resolve, reject) => {
            var query = 'select escolar.function_get_password("'+usuario.contra+'") as "contra"';

            connection.invokeQuery(query, function (rows){
                query = 'SELECT * FROM escolar.tb_usuarios WHERE username = "'+usuario.usuario+
                '" and password = "'+rows[0].contra+'"';

                connection.invokeQuery(query, function (row){
                    resolve(row);
                });
            });
        });
    },
};