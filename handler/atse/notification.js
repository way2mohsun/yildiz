var express = require('express');
var HashMap = require('hashmap').HashMap;
var q = new HashMap();
var router = express.Router();
var hamrahvas = require('../../mapfa/hamrah-vas');
var jalali = require('../../util/jalali');

router.get('/', function (req, res, next) {
    var support = '';
    if (jalali.nameOfTheWeekday() === 'Saturday' || jalali.nameOfTheWeekday() === 'Monday' || jalali.nameOfTheWeekday() === 'Wednesday')
        support = '\n' + 'شماره پشتیبانی:۲۲۶۳۹۶۷۱(۰۲۱)';

    req.query.service_name = 'Atse Interactive';
    require('../../dao/service').getService(req, function (result) {
        require('../../dao/questionnaire').setNewDayTransaction(req, function (tr) {
            if (tr.length === 0) {
                console.log(new Error("Phone numbers dont find!!!"));
                return res.end();
            }
            require('../../dao/service').getQuestion(req, function (questions) {
                if (questions.length === 0) {
                    console.log(new Error("Error in value of : " + req.query.service_key));
                    res.end();
                    return;
                }
                for (var i in questions) {
                    q.set(Number(i) + 1, questions[i].value);
                }
                var tel = [];
                var text = [];
                for (var i in tr) {
                    if (tel.length === 90) {
                        hamrahvas.sendSMS(tel, 9830568, text, 1808, 0, '01', function (callback) {
                        });
                        tel = [];
                        text = [];
                    }
                    if (q.has(tr[i].question + 1)) {
                        tel.push(tr[i].tel);
                        text.push(q.get(tr[i].question + 1) + support);
                    }
                }
                if (tel.length !== 0) {
                    hamrahvas.sendSMS(tel, 9830568, text, 1808, 0, '01', function (callback) {
                    });
                }
                res.end();
            });
        });
    });
});

module.exports = router;