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
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');

var socketIO = io.of('/apiNamespace')
socketIO.on('connection', function(socket) {
  socket.join('spotRoom');
});

http.listen(process.env.PORT || 1000, function() {
});

app.use(cors());


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(session({
  secret: 'trainspot'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./configuration/passport')(passport);

var roles = require('./configuration/connectroles')();


var routes = require('./routes/index')(express.Router(), passport);
var api = require('./routes/api')(express.Router(), socketIO, passport, roles);

app.use(roles.middleware());
app.use(cookieParser());
app.use('/', routes);
app.use('/api', api);


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