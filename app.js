/* global __dirname */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mysql = require('mysql');
var connection = require('express-myconnection');
//redis
var redisStore = require('connect-redis')(session);
var uuid = require('node-uuid');


var app = express();

var conn = JSON.parse(require('fs').readFileSync(__dirname + '/package.json', 'utf8')).ConnectionProperty;
app.use(connection(mysql, conn, 'pool'));

app.use(session({
    resave: true,
    cookie: {
        //maxAge: 1000 * 60 * 60 * 24
        maxAge: 10000
    },
    saveUninitialized: true,
    secret: 'uwotm8',
    store: new redisStore({
        host : 'localhost',
        port : '6379'
    })
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').renderFile);
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/sms.jpg'));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/css", express.static(__dirname + '/css'));
app.use("/img", express.static(__dirname + '/public/images'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/jquery", express.static(__dirname + '/public/jquery-2.1.4'));
app.use("/bootstrap", express.static(__dirname + '/public/bootstrap-3.3.5'));
app.use("/bootstrap-table", express.static(__dirname + '/public/bootstrap-table-1.3.0'));
app.use("/bootstrap-confirmation", express.static(__dirname + '/public/Bootstrap-Confirmation'));
app.use("/dp", express.static(__dirname + '/public/jalali-datepicker'));
app.use("/util", express.static(__dirname + '/util/4web'));

app.use('/', require('./routes/login'));
app.use('/users', require('./routes/users'));
app.use('/scheduler-bulk', accessRequire, require('./routes/scheduler-bulk'));
app.use('/service', accessRequire, require('./routes/service'));
app.use('/logout', require('./routes/logout'));
app.use('/mo', require('./routes/mo'));
app.use('/home', loginRequire, require('./routes/home'));
app.use('/demo', require('./routes/demo'));
app.use('/hamrah-vas-panel-tajmiei', require('./routes/hamrah-vas-panel-tajmiei'));
app.use('/signal-notification', require('./handler/signal/notification'));
app.use('/atse-notification', require('./handler/atse/notification'));
app.use('/signal-export', accessRequire, require('./routes/signal-export'));
app.use('/why', accessRequire, require('./routes/why'));
app.use('/mt-stats', accessRequire, require('./routes/mt-stats'));
app.use('/2night-notification', accessRequire, require('./routes/2night-notification'));
app.use('/how2off', require('./handler/how2off'));

function loginRequire(req, res, next) {
    if (req.session.user_id) {
        next(); // allow the next route to run
    } else {
        res.redirect("/"); // or render a form, etc.
    }
}

function accessRequire(req, res, next) {
    if (!req.session.user_id) {
        res.redirect("/");
        return;
    }
    var access = req.session.access;
    var url = req.originalUrl.substr(1, req.originalUrl.lengh);
    var status = true;
    for (var i in access) {
        if (access[i] === url) {
            status = false;
        }
    }
    if (status) {
        res.redirect('/logout');
    } else {
        next();
    }
}

require('./dao/scheduler').find(function (callback){});
require('./handler/daily-content/notification').notificationStartupTime(conn);
//require('./handler/how2off').notificationStartupTime(conn);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.html');
});

module.exports = app;
