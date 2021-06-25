  require('./librerias/librerias');
  var app = express();

  //Herramientas
  require('./herramientas/connectionBD');
  require('./herramientas/connectionSFTP');
  require('./herramientas/rutas');

  //cors
  app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      res.header("Access-Control-Allow-Headers", "Authorization, X-Requested-With, Accept, Content-Type, Origin, Cache-Control, X-File-Name");
      next();
  });

  app.use(express.static('public/jurado'));

  app.use(bodyParser.json({ limit: '99999mb' }));
  app.use(bodyParser.urlencoded({ limit: '99999mb', extended: true }));
  app.use(cookieParser());

  //APP
  app.use('/', indexRouter);
  app.use('/login', loginRouter);

  app.use('/academica/literaturas', literaturasRouter);
  app.use('/academica/videos', videosRouter);

  app.use('/promocion/programacion', programacionRouter);
  app.use('/promocion/publicidadbanner', publicidadRouter);
  app.use('/promocion/formulario_sesionesvirtuales', formularios_sesionesvirtualesRouter);

  //Ruta generica de archivos
  app.use('/generico/files', genericoUploadRouter);

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  // error handler
  app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
  });

  module.exports = app;