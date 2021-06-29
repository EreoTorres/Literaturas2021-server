var credencialesAWS = require('../herramientas/credencialesAWS');

module.exports = {
    getAmbiente: function(tipoUsuario) {
        if (tipoUsuario == 0) {
            return 'produccion'
        } else {
            return 'pruebas'
        }
    },
    getFilesBase64(base, path) {
        return new Promise((resolve, reject) => {
            var base64Data = base.split(',').pop();
            binaryData = new Buffer(base64Data, 'base64').toString('binary');

            require("fs").writeFile(path, binaryData, "binary", function(err) {
                if (err) {
                    console.error(err)
                    return
                }

                resolve(true)
            });
        })
    },
    deteleFiles(path) {
        require("fs").unlink(path, (err) => {
            if (err) {
                console.error(err)
                return
            }
            //file removed
        })
    },
    formatoFechaInsert() {
        var pDate = '22/03/2021';
        let dd = pDate.split("/")[0].padStart(2, "0");
        let mm = pDate.split("/");

        if (mm.length != 2) {
            mm = pDate.split("/")[1].padStart(2, "0");
        } else {
            mm = pDate.split("/")[1];
        }

        let yyyy = pDate.split("/")[2].split(" ")[0];
        mm = (parseInt(mm) - 1).toString();

        return yyyy + '-' + mm + '-' + dd;
    },
    eliminarDiacriticos: function(texto) {
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    },
    eliminarEspacios: function(texto) {
        return texto.replace(/ /g, "_");
    },
    mysql_real_escape_string: function(str) {
        return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function(char) {
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
                    return "\\" + char; // prepends a backslash to backslash, percent,
                    // and double/single quotes
                default:
                    return char;
            }
        });
    },
    getCredencialesAWSS3(credencial_id) {
        if (credencial_id == 1) {
            aws.config.update(credencialesAWS.genericos.config);
            return credencialesAWS.genericos;
        }

        return false;
    }
};