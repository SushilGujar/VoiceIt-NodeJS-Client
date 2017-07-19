// define app config params
var binaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');
var server = binaryServer({
    port: 9000
});

server.on('connection', function(client) {
    console.log('new connection established');
    client.on('stream', function(stream, meta) {
        var filename = meta.name + '_' + Date.now() + '.wav'
        console.log('received stream');
        var file = fs.createWriteStream('./wav/' + filename);

        stream.pipe(file);

        stream.on('end', function() {
            file.end();
            console.log('file created: ' + filename);
            //end of stream
            //****Immediate response to client******
            stream.write(JSON.stringify({'filename' : filename}));
        });

    });
});
