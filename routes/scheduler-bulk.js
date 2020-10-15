var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require('fs');

router.get('/', function (req, res, next) {
    res.set('content-type', 'text/html');
    console.log(req.query.page === 'history');
    if (typeof req.body.page !== "undefined" && req.query.page === 'history') {
        res.render('bulk/scheduler-history.html');
    } else {
        res.render('bulk/scheduler.html');
    }
});

router.post('/', function (req, res, next) {
    if (typeof req.body.functionality === "undefined" && req.body.functionality === 'get' && req.body.hasOwnProperty('id')) {
        require('../dao/scheduler').get(req, function (callback) {
            res.json(callback);
        });
        return;
    }
    if (typeof req.body.functionality === "undefined" && req.body.functionality === 'edit' && req.body.hasOwnProperty('id')) {
        req.body.startup_date = require('../util/jalali').j2g(req.body.startup_date);
        require('../dao/scheduler').edit(req, function (callback) {
            res.json(callback);
        });
        return;
    }
    if (typeof req.body.functionality === "undefined" && req.body.functionality === 'getAll') {
        require('../dao/scheduler').getAll(req, function (callback) {
            res.json(callback);
        });
        return;
    }
    if (typeof req.body.functionality === "undefined" && req.body.functionality === 'delete' && req.body.hasOwnProperty('id')) {
        require('../dao/scheduler').del(req, function (callback) {
            res.json(callback);
        });
        return;
    }
    if (typeof req.body.functionality === "undefined" && req.body.functionality === 'getHistory') {
        require('../dao/scheduler').getHistory(req, function (callback) {
            res.json(callback);
        });
        return;
    }
    var form = new multiparty.Form();
    form.uploadDir = '/scheduler-file';
    form.encoding = 'utf-8';
    form.keepExtensions = true;
    form.autoFiles = false;
    
    form.on('file', function (name, file) {
    });

    form.on('aborted', function () {
    });

    form.on('error', function (err) {
        return next(err);
    });

    form.parse(req, function (err, fields, files) {
        var check = checkPrarameters(fields, files);
        //console.log('check.hasOwnProperty(message) : ' + check.hasOwnProperty('message'));
        if (check.hasOwnProperty('message')) {
            res.status(500);
            res.json(check.message);
            return;
        }
        fields["startup-date"][0] = require('../util/jalali').j2g(fields["startup-date"][0]);
        require('../dao/scheduler').create(fields, req, function (callback) {
            if (callback) {
                fs.rename(files.file[0].path, '/scheduler-file/' + callback.insertId + '.txt', function (err) {
                    if (err) {
                        return next(err);
                    }
                });
            }
        });
        res.json('Register !!!');
    });
});

function checkPrarameters(fields, files) {
    //console.log(JSON.stringify(fields));
    //console.log(JSON.stringify(files));
    if (typeof files === "undefined" ||
            typeof fields === "undefined") {
        return {message: 'One of the param was missed !!!'};
    }
    if (!fields.hasOwnProperty('service-key') ||
            !fields.hasOwnProperty('short-code') ||
            !fields.hasOwnProperty('startup-time') ||
            !fields.hasOwnProperty('startup-date') ||
            !fields.hasOwnProperty('username') ||
            !fields.hasOwnProperty('password') ||
            !fields.hasOwnProperty('domain') ||
            !fields.hasOwnProperty('message')) {
        return {message: 'One of the param was not filled !!!'};
    }
    if (Object.getOwnPropertyNames(files).length === 0) {
        return {message: 'No text file was attached !!!'};
    }
    if (fields["startup-date"][0].length === 0 ||
            fields["startup-time"][0].length === 0 ||
            fields["short-code"][0].length === 0 ||
            fields["service-key"][0].length === 0 ||
            fields["username"][0].length === 0 ||
            fields["password"][0].length === 0 ||
            fields["domain"][0].length === 0 ||
            fields["message"][0].length === 0) {
        return {message: 'One of the param was not complete !!!'};
    }
    return {};
}

module.exports = router;