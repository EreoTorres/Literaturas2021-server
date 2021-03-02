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
    },
    mysql_real_escape_string: function (str) {
        return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
            switch (char) {
                case "\0":
                    return "\\0";
                case "\x08":
                    return "\\b";
                case "\x09":
                    return "\\t";
                case "\x1a":
                    return "\\z";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "\"":
                case "'":
                case "\\":
                case "%":
                    return "\\"+char; // prepends a backslash to backslash, percent,
                                      // and double/single quotes
                default:
                    return char;
            }
        });
    }
};