var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// Error Handler Module use
var expressErrorHandler = require('express-error-handler');

// mongodb Modoule use
var MongoClient = require('mongodb').MongoClient;

var database;

function connectDB() {
  var databaseUrl = 'mongodb://localhost:27017/local';

  MongoClient.connect(databaseUrl, funciton(err, db) {
    if(err) {
      console.log('database connent error occur.')
      return;
    }

    console.log('connect database : ' + databaseUrl);
    database = db;
  });
}

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

router.route('/process/login').post(funciton(req, res) {
  console.log('/process/login routing function call0');

  var paramId - req.body.id || req.query.id; 
  var paramPassword = req.body.password || req.query.password;
  console.log('request Parameter :' + paramId + ', ' + paramPassword);
  
  if(database) {
    authUser(database, paramId, paramPassword, function (err, docs) {
      if (err) {
        console.log('error return');
        res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
        res.write('<h1>error return</h1>');
        res.end();
        return;
      }

      if (docs) {
        console.dir(docs);

        res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
        res.write('<h1>success login/h1>');
        res.write('<div><p>user : ' + docs[0].name +  </p></div>');
        res.end();
        return;

      }
    });
  }
});

app.use('/', router);


var authUser = function (db, id, password, callback) {
  console.log('authUser Call. : ' + id + ',' + password);

  var users = db.collection('users');

  users.find({ "id": id, "password": password }).toArray(function (err, docs) {
    if (err) {
      callback(err, null);
      return;
    }

    if (docs.length > 0) {
      console.log('find a user.')
      callback(null, docs);
    } else {
      console.log('can not find user.');
      callback(null, null);
    }
  });
};


// 404 Error Page Handle
var errorHandler = expressErrorHandler({
  static: {
    '404': './pubilc/404.html'
  }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);


var server = http.createServer(app).listen(app.get('port'), function () {
  console.log('Web sever with Express : ' + app.get('port'));

  connectDB();
})