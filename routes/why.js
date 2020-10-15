var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.set('content-type', 'text/html');
    res.render('why.html');
});

router.post('/', function (req, res, next) {
    if (req.body.hasOwnProperty('functionality') && req.body.functionality === 'getAll') {
        require('../dao/questionnaire').getWhyQuestions(req, function (callback) {
            res.json(callback);
        });
        return;
    }
    if (req.body.hasOwnProperty('functionality') && req.body.functionality === 'save-new-question') {
        require('../dao/questionnaire').setWhyQuestions(req, function (callback) {
            res.json('Register !!!');
        });
        return;
    }
    if (req.body.hasOwnProperty('functionality') && req.body.functionality === 'delete-question' && req.body.hasOwnProperty('id')) {
        require('../dao/questionnaire').deleteWhyQuestions(req, function (callback) {
            res.end();
        });
        return;
    }
    res.writeHead(500, {'Content-Type': 'application/json'});
    res.end({message : 'Please fill the mentioned field !'});
});

module.exports = router;