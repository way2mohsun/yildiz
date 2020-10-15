var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require('fs');

router.get('/', function (req, res, next) {
    res.set('content-type', 'text/html');
    res.render('dropzone.html');
});

router.post('/', function (req, res, next) {
    var form = new multiparty.Form();
    form.uploadDir = '/scheduler-file';
    form.encoding = 'utf-8';
    form.keepExtensions = true;
    form.autoFiles = false;

    form.on('file', function (name, file) {
        fs.rename(file.path, '/scheduler-file/user-id-shortcode-service-id.txt', function (err) {
            if (err)
                console.log('ERROR: ' + err);
        });
    });

    form.on('aborted', function () {
    });

    form.on('error', function (err) {
        return next(err);
    });

    form.parse(req, function (err, fields, files) {
        console.log(fields.user_id[0]);
        res.end();
    });
    
});

module.exports = router;