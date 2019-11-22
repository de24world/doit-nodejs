var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// Error Handler Module use
var expressErrorHandler = require('express-error-handler');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(
  expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
  })
);

var router = express.Router();

app.use('/', router);

// 404 Error Page Handle
var errorHandler = expressErrorHandler({
  static: {
    '404': './pubilc/404.html'
  }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);
