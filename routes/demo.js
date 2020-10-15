var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require('fs');

router.get('/', function(req, res, next) {
    var path = '/Users/Mohsun/Downloads/Telegram Desktop/fun.mp4';
    fs.exists(path, function(exists) {
        if (exists) {
            res.writeHead(200, {'Content-Type': 'video/mp4'});
            fs.readFile(path, function(err, data) {
                if (err) throw err;
                res.end(data);
            });
        } else {
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: 'Video Not Found'}));
        }
    });
});

router.post('/', function (req, res, next) {
    console.log(req.body.id);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({name: '123'}));
});

module.exports = router;
