exports.processRequest = processRequest;

function processRequest(req) {
    require('../../dao/subscriber').getSubscriber(req, function (sub) {
        var jdate = require('../../util/jalali').jToday();
        if (sub.length === 0) {
            require('../../dao/questionnaire').setNewTransaction(req, function (tr) {
                req.query.subscriber_id = tr.sub;
                if (tr.reactivation === true) {
                    req.query.service_key = 'reactivation welcome';
                    require('../../dao/service').getProp(req, function (welcome) {
                        require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, welcome, req.query.service, 21, '00', function (callback) {
                            //console.log(jdate + ':' + callback + ':' + welcome);
                            setTimeout(function () {
                                lastQuestion(req);
                            }, 3000);
                        });
                    });
                } else {
                    req.query.service_key = 'welcome';
                    require('../../dao/service').getProp(req, function (welcome) {
                        require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, welcome, req.query.service, 21, '01', function (callback) {
                            //console.log(jdate + ':' + callback + ':' + welcome);
                            setTimeout(function () {
                                lastQuestion(req);
                            }, 3000);
                        });
                    });
                }
            });
            //});
            return;
        }
        // before subscribe
        req.query.service_key = 'before activated';
        req.query.subscriber_id = sub[0].id;
        require('../../dao/service').getProp(req, function (beforeActivated) {
            require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, beforeActivated, req.query.service, 0, '00', function (callback) {
                //console.log(jdate + ':' + callback + ':' + beforeActivated);
                //lastQuestion(req);
            });
        });
    });
}

function lastQuestion(req) {
    require('../../dao/questionnaire').getTransaction(req, function (questionnaire) {
        if (questionnaire.length !== 1) {
            console.log(new Error("Error in get Transaction"));
            return;
        }
        var jDate = require('../../util/jalali').jToday();
        var gDate = require('../../util/jalali').gToday().substr(0, 10);
        if (questionnaire[0].date.toString() === gDate) {
            req.query.service_key = 'no question has remained';
            require('../../dao/service').getProp(req, function (noQuestion) {
                require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, noQuestion, req.query.service, 0, '00', function (callback) {
                    //console.log(jDate + ':' + callback + ':' + noQuestion);
                });
            });
            return;
        }
        req.query.service_key = 'question-' + gDate;
        require('../../dao/service').getProp(req, function (question) {
            require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, question, req.query.service, 0, '01', function (callback) {
                //console.log(jDate + ':' + callback + ':' + question);
            });
        });
    });
}