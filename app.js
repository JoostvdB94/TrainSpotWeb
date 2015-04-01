require('./configuration/db');
var express = require('express');
var cors = require('cors');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');

var socketIO = io.of('/apiNamespace')
socketIO.on('connection', function(socket) {
  socket.join('locationRoom');
});

var routes = require('./routes/index')(express.Router());
var api = require('./routes/api')(express.Router(), socketIO);
var crud = require('./routes/crud')(express.Router());

http.listen(process.env.PORT || 1000, function() {
  console.log('listening on: ' + process.env.PORT || 1000);
});

app.use(cors());




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  extended: false
}));



app.use(cookieParser());
app.use('/', routes);
app.use('/api', api);
//app.use('/api/images', require('./routes/images.js')(express.router()))
app.use('/crud', crud);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;