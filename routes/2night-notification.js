var express = require('express');
var router = express.Router();
var survey = require('../dao/survey');
var hamrahvas = require('../mapfa/hamrah-vas');
var service = require('../dao/service');
var subscriber = require('../dao/subscriber');

router.get('/', function (req, res, next) {
    res.set('content-type', 'text/html');
    res.render('2night-notification.html');
});

router.post('/', function (req, res, next) {
    if (req.body.hasOwnProperty('functionality') && req.body.functionality === 'get') {
        survey.get(req, next, function (err, result) {
            if (err) {
                res.status(500);
                res.json('Error in calling survey.get');
                return;
            }
            res.json(result);
        });
        return;
    }
    if (req.body.hasOwnProperty('functionality') &&
            req.body.functionality === 'send message' &&
            req.body.hasOwnProperty('message')) {
        sendMessage(req, res);
        return;
    }
});

function sendMessage(req, res) {

    survey.set(req, function (sur) {
        if (sur) {
            res.status(500);
            res.json('Error in calling set survey message');
            return;
        }
        req.query.service_name = '2Night';
        service.getServiceByName(req, function (err) {
            if (err) {
                res.status(500);
                res.json('Error in calling set survey message');
                return;
            }
            subscriber.getSubscribers(req, function (sub) {
                var tel = [];
                for (var i in sub) {
                    if (tel.length === 90) {
                        hamrahvas.sendSMS(tel, 9830568, req.body.message, 1666, 0, '01', function (callback) {
                        });
                        tel = [];
                    }
                    tel.push(sub[i].tel);
                }
                if (tel.length !== 0) {
                    hamrahvas.sendSMS(tel, 9830568, req.body.message, 1666, 0, '01', function (callback) {
                        res.end();
                    });
                } else {
                    res.end();
                }
            });
        });
    });
}

module.exports = router;
