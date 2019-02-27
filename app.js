var express = require('express');
var app = express();
app.set('view engine', 'ejs');



// route pages
app.get('/', function (req, res) {
  res.render('index')
});


// what port to run server on
app.listen(3001, function () {
  console.log('server started on port 3001');
});
