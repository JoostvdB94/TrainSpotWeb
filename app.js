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
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');
var connectRoles = require('connect-roles');
var User = mongoose.model('user');
var routes = require('./routes/index')(express.Router());
var api = require('./routes/api')(express.Router(), io);
var crud = require('./routes/crud')(express.Router());

io.on('connection', function(socket) {
  console.log("user is connected");
});
http.listen(process.env.PORT || 1000, function() {
  console.log('listening on: ' + process.env.PORT || 1000);
});

app.use(cors());
app.use(session({
  secret: 'login'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use('login', new LocalStrategy(
  function(username, password, done) {
    User.findOne({
      name: username
    }, function(err, user) {
      if (err) {
        console.log(err);
        return done(err);
      }
      if (!user) {
        console.log("User " + username + " not known");
        return done(null, false, {
          message: 'Incorrect username.'
        });
      }
      if (!user.validPassword(password)) {
        console.log("User " + username + " known, but password not correct");
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
      console.log("Guessed the password eh?");
      return done(null, user);
    });
  }
));

passport.use('signup', new LocalStrategy({
    passReqToCallback: true
  },
  function(req, username, password, done) {
    findOrCreateUser = function() {
      // find a user in Mongo with provided username
      User.findOne({
        'name': username
      }, function(err, user) {
        // In case of any error return
        if (err) {
          console.log('Error in SignUp: ' + err);
          return done(err);
        }
        // already exists
        if (user) {
          console.log('User already exists');
          return done(null, false,
            req.flash('message', 'User Already Exists'));
        } else {
          // if there is no user with that email
          // create the user
          var newUser = new User();
          // set the user's local credentials
          newUser.name = username;
          newUser.password = createHash(password);

          // save the user
          newUser.save(function(err) {
            if (err) {
              console.log('Error in Saving user: ' + err);
              throw err;
            }
            console.log('User Registration succesful');
            return done(null, newUser);
          });
        }
      });
    };

    // Delay the execution of findOrCreateUser and execute 
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  }));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var roles = new connectRoles({
  failureHandler: function(req, res, action) {
    res.send('Toegang geweigerd. U heeft geen toegang tot ' + action);
  }
});

roles.use('access crud', function(req) {
  if (req.user != undefined) {
    return true;
  }
});



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
app.use('/crud', roles.can('access crud'), crud);



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