var express = require('express');

var path = require('path');

var cors = require('cors')

var serveStatic = require('serve-static');

app = express();

app.use(serveStatic(path.join(__dirname)));

allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if ('OPTIONS' === req.method) {
    res.send(200);
  } else {
    next();
  }
};

app.use(allowCrossDomain);

app.get('*', function(req, res) {
    res.redirect('/');
});

var port = process.env.PORT || 5000;

app.listen(port);

console.log('server started '+port);
