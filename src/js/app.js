var express = require('express');
var app = express();
app.set('view engine', 'ejs');



// route pages
app.get('/', function (req, res) {
    res.render('index')
});
app.post('/create', function(req, res){
	console.log(req.body)
	res.status(201)
	res.end
});


// what port to run server on
app.listen(3001, function () {
  console.log('server started on port 3001');
});
