var express = require('express');
var HashMap = require('hashmap').HashMap;
var q = new HashMap();
var router = express.Router();

router.get('/', function (req, res, next) {
    var gDate = require('../../util/jalali').gToday().substr(0, 10);
    req.query.service_name = 'Why Interactive';
    req.query.service_key = 'question-' + gDate;
    require('../../dao/service').getService(req, function (results) {
        require('../../dao/service').getProp(req, function (question) {
            if (question === null) {
                return;
            }
            require('../../dao/subscriber').getSubscribers(req, function (sub) {
                var tel = [];
                for (var i in sub) {
                    if (tel.length === 90) {
                        require('../../mapfa/hamrah-vas').sendSMS(tel, 9830568, question, 1666, 0, '01', function (callback) {
                            //console.log(require('../../util/jalali').jToday() + ':' + callback + ':' + tel + ':' + question);
                        });
                        tel = [];
                    }
                    tel.push(sub[i].tel);
                }
                if (tel.length !== 0) {
                    require('../../mapfa/hamrah-vas').sendSMS(tel, 9830568, question, 1666, 0, '01', function (callback) {
                        //console.log(require('../../util/jalali').jToday() + ':' + callback + ':' + tel + ':' + question);
                    });
                    res.end();
                }
            });
        });
    });
});

module.exports = router;