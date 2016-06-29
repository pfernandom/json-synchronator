/**
 * Created by Pedro on 6/28/2016.
 */

var express = require('express'),
	fs = require('fs')
url = require('url');

var bodyParser = require('body-parser');
var app = express();

var port = process.env.PORT || 8080;
app.use(express.static('public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});


app.get('/getFiles', function (req, res) {
	fs.readdir('public/json', function (err, data) {
		if (err) {
			throw err;
		}
		else {
			res.send(data);
			res.end();
		}

	});
});


app.post('/receive', function (request, respond) {
	filePath = 'public/data.txt';
	console.log(request.body);
	fs.writeFileSync(filePath, request.body.test);
	respond.end();

});

app.listen(port, function () {
	console.log('json-synchronator editor running in port ' + port);
});