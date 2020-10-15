exports.processRequest = processRequest;

function processRequest(req) {
    require('../../dao/subscriber').getSubscriber(req, function (sub) {
        var jDate = require('../../util/jalali').jToday();
        var gDate = require('../../util/jalali').gToday().substr(0, 10);
        // is not subscriber
        if (sub.length === 0) {
            req.query.service_key = 'should be subscriber';
            require('../../dao/service').getProperty(req, function (shouldBeSubscriber) {
                require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, shouldBeSubscriber[0].value, req.query.service, 0, '00', function (callback) {
                    //console.log(jDate + ':' + callback + ':' + shouldBeSubscriber[0].value);
                });
            });
            return;
        }
        req.query.subscriber_id = sub[0].id;
        require('../../dao/questionnaire').getTransaction(req, function (transaction) {
            if (transaction[0].date.toString() === gDate) {
                req.query.service_key = 'no question has remained';
                require('../../dao/service').getProperty(req, function (noQuestion) {
                    require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, noQuestion[0].value, req.query.service, 0, '00', function (callback) {
                        //console.log(jDate + ':' + callback + ':' + noQuestion[0].value);
                    });
                });
            } else {
                req.query.service_key = 'selection';
                require('../../dao/service').getProperty(req, function (selection) {
                    if (req.query.text.match(selection[0].value) === null) {
                        req.query.service_key = 'wrong-selection';
                        require('../../dao/service').getProperty(req, function (wrong) {
                            require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, wrong[0].value, req.query.service, 0, '00', function (callback) {
                                //console.log(jDate + ':' + callback + ' : ' + wrong[0].value);
                            });
                        });
                    } else {
                        process(req, transaction);
                    }
                });
            }
        });
    });
}

function process(req, questionnaire) {
    var jDate = require('../../util/jalali').jToday();
    var gDate = require('../../util/jalali').gToday().substr(0, 10);
    if (questionnaire.length !== 1) {
        console.log(new Error("Error in questionnaire"));
        return;
    }
    req.query.service_key = 'answer-' + gDate;
    require('../../dao/service').getProperty(req, function (answer) {
        req.query.text = require('../../util/digit-convertor').toEnDigit(req.query.text);
        if (req.query.text === answer[0].value) {
            req.query.isCorrect = 'true';
        } else {
            req.query.isCorrect = 'false';
        }
        require('../../dao/questionnaire').answer(req);
        req.query.service_key = (req.query.isCorrect === 'true' ? 'correct-' : 'wrong-') + gDate;
        require('../../dao/service').getProperty(req, function (motivation) {
            require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, motivation[0].value, req.query.service, 0, '01', function (callback) {
                //console.log(jDate + ':' + callback + ':' + motivation[0].value);
            });
        });
    });
}







