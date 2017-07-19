// require express
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

// create our router object
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var key1 = '01ff408c066c42a097792fad24a7a895';
var key2 = '99864a2c786840fdaee558f10959cd53';

// route for root domain
router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// route for user
router.get('/user', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/createuser.html'));
});

// routes for enrollment
const https = require('https');

router.get('/enroll', function(req, res) {
    var options = {
      hostname: 'westus.api.cognitive.microsoft.com',
      path: '/spid/v1.0/verificationProfiles/{8a11919e-a2bf-4524-a68f-72562cf32df6}?',
      method: 'GET',
      headers: {
        'Ocp-Apim-Subscription-Key': key2},
      rejectUnauthorized: true
    };

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    var req = https.request(options, (res) => {
      console.log('statusCode:', res.statusCode);
      console.log('headers:', res.headers);

      res.on('data', (d) => {
        process.stdout.write(d);
      });
    });

    req.on('error', (e) => {
      console.error(e);
    });
    res.sendFile(path.join(__dirname, '../public/enroll.html'));
});

router.post('/enroll', function(req, res) {

});

router.get('/auth', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/auth.html'));
});

router.post('/auth', function(req, res) {
});

// Create bucket if doesn't exist
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './wav');
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
});

var upload = multer({
    storage: storage
}).single('voice-input');

router.post('/upload', function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            console.error(err);
            return res.end('Error during upload: ', err);
        }
        res.end('File uploaded!');
    });
});

router.put('/wav', function(req, res) {
    console.log('Audio received');
    var body = [];
    var outstream = fs.createWriteStream('./wav/test.wav')
    req.on('data', function(chunk) {
        body.push(chunk);
    });

    var instream = fs.createReadStream(Buffer.concat(body));
    console.log('Audio received');
    instream.pipe(outstream);
    res.end('Audio uploaded!');
    return;
});

//export our router
module.exports = router;
