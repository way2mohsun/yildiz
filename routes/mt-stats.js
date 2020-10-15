var express = require('express');
var router = express.Router();
var d = require('../util/jalali');

router.get('/', function (req, res, next) {
    res.set('content-type', 'text/html');
    res.render('mt-stats.html');
});

router.post('/', function (req, res, next) {
    if (typeof req.body.functionality !== 'undefined' && req.body.functionality === 'get services') {
        require('../dao/service').getServiceNames(req, function (callback) {
            res.json(callback);
        });
        return;
    }
    if (typeof req.body.functionality !== 'undefined' &&
            req.body.functionality === 'stats' &&
            req.body.hasOwnProperty('service') &&
            req.body.hasOwnProperty('type') &&
            req.body.hasOwnProperty('from') &&
            req.body.hasOwnProperty('to')) {
        req.body.from = req.body.from.split('-');
        req.body.from = new Date(req.body.from[0], Number(req.body.from[1]) - 1, req.body.from[2]);
        req.body.to = req.body.to.split('-');
        req.body.to = new Date(req.body.to[0], Number(req.body.to[1]) - 1, req.body.to[2]);
        var distance = d.getBetweenDates(req.body.from, req.body.to);
        var f = '';
        for (var i in distance) {
            f += '/logs/mt.log-' + distance[i] + ' ';
        }
        var exec = require('child_process').exec;
        var cmd = 'grep ":' + req.body.service + ':' + req.body.type + ':Success" ' + f + ' | wc -l';
        exec(cmd, function (error, stdout, stderr) {
            if (error)
                res.end('Error');
            res.end(stdout);
        });
        return;
    }
    res.end();
});

module.exports = router;