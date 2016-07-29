var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(__dirname + '/dist'));

app.get('*', function(req, res){
	res.sendFile(path.join(__dirname + '/dist/index.html'));
});

var ip = '0.0.0.0';

if(process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test') {
	ip = '127.0.0.1';
}

app.listen(3012, ip, function(){
	console.log('Running on ' + ip + ':' + 3012);
});