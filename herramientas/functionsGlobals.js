module.exports = {
    getAmbiente: function (tipoUsuario) {
        if(tipoUsuario == 0){
            return 'produccion'
        }else{
            return 'pruebas'
        }
    },
    eliminarDiacriticos: function (texto) {
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
    },
    eliminarEspacios: function (texto) {
        return texto.replace(/ /g, "_");
    }
};