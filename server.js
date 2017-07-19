// define app config params
const PORT = 8080;
// require
var http = require('http');
var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');
var router = require('./route/routes');
// var fs = require('fs');
//
// var options = {
//     key: fs.readFileSync('fakekey/key.key'),
//     cert: fs.readFileSync('fakekey/cert.cert')
// };

var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var httpsServer = http.createServer(app);

//router of the app
app.use('/', router);

// set static files location
app.use(express.static(__dirname + '/public'));

var binaryServer = require('binaryjs').BinaryServer;

// start the server
httpsServer.listen(PORT, function() {
    console.log('app is running on port ' + PORT);
});

var server = binaryServer({
    port: 8080
});
server.on('connection', function(client) {
    client.on('stream', function(stream, meta) {
        var file = fs.createWriteStream('./wav/' + meta.file);
        stream.pipe(file);
        stream.on('end', function() {
            fileWriter.end();
        });
    });
});
