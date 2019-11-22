var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

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

app.all('*', function(req, res) {
  res.status(404).send('<h1>There is no request Page.</h1>');
});

var server = http.createServer(app).listen(app.get('port'), function() {
  console.log('Play Web Server with Express : ' + app.get('port'));
});
