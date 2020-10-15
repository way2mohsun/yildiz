var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.set('content-type', 'text/html');
    res.render('interactive-export.html');
});

router.post('/', function (req, res, next) {
    if (req.body.hasOwnProperty('functionality') && req.body.functionality === 'get all' && req.body.hasOwnProperty('service')) {
        require('../dao/questionnaire').getSignalExport(req, function (callback) {
            res.json(callback);
        });
        return;
    }
    if (req.body.hasOwnProperty('functionality') && req.body.functionality === 'stats' && req.body.hasOwnProperty('date') && req.body.hasOwnProperty('service')) {
        require('../dao/questionnaire').getStats(req, function (callback) {
            res.json(callback);
        });
        return;
    }
    if (req.body.hasOwnProperty('functionality') && req.body.functionality === 'get services') {
        require('../dao/service').getServiceNames(req, function (callback) {
            res.json(callback);
        });
        return;
    }
    return next(new Error("Error on param"));
});

module.exports = router;
//JSON.stringify