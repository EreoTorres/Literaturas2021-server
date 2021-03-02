  var config = require('./dbConfig');

  global.connection = module.exports = function(){};

  createDBConnection = function (){
    var mysqlConnection = mysql.createConnection({
      host: config.mysqlConfig.host,
      user: config.mysqlConfig.user,
      password: config.mysqlConfig.password,
      database: config.mysqlConfig.database,
      connectTimeout: config.mysqlConfig.timeout
    });

    return mysqlConnection;
  };

  connection.invokeQuery = function (sqlQuery, resRows){
    var ssh = new SSH2client();
    ssh.connect(config.sshTunnelConfig);

    ssh.on('ready', function () {
      ssh.forwardOut(
        config.localhost,
        config.mysqlConfig.timeout,
        config.localhost,
        config.mysqlConfig.port,
        function (err, stream){
          if(err) {console.log(err)};

          config.mysqlConfig.stream = stream;
          var db = mysql.createConnection(config.mysqlConfig);

          db.query(sqlQuery,function (err, rows){
            if(rows){
              resRows(rows);
            }

            if(err){ resRows(err) }
          });
        }
      )
    })
  };
