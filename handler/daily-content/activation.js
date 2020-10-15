exports.processRequest = processRequest;
var subscriber = require('../../dao/subscriber');
var hamrahvas = require('../../mapfa/hamrah-vas');
var service = require('../../dao/service');
var jdate = require('../../util/jalali');

function processRequest(req) {
    subscriber.getSubscriber(req, function (sub) {
        if (sub.length === 0) {
            subscriber.setSubscriber(req, function (tr) {
                req.query.subscriber_id = tr.sub;
                if (tr.reactivation) {
                    req.query.service_key = 'reactivation welcome';
                    service.getProperty(req, function (welcome) {
                        if (welcome.length !== 1) {
                            console.log(new Error("Error in value of : " + req.query.service_key));
                            return;
                        }
                        hamrahvas.sendSMS(req.query.tel, req.query.scode, welcome[0].value, req.query.service, 21, '00', function (callback) {
                            setTimeout(function () {
                                sendLastContent(req, tr.reg_date);
                            }, 3000);
                        });
                    });
                    return;
                }
                req.query.service_key = 'welcome';
                service.getProperty(req, function (welcome) {
                    if (welcome.length !== 1) {
                        console.log(new Error("Error in value of : " + req.query.service_key));
                        return;
                    }
                    hamrahvas.sendSMS(req.query.tel, req.query.scode, welcome[0].value, req.query.service, 21, '00', function (callback) {
                        setTimeout(function () {
                            sendFirstContent(req);
                        }, 3000);
                    });
                });

            });
            return;
        }
        // before subscribe
        req.query.service_key = 'before activated';
        req.query.subscriber_id = sub[0].id;
        service.getProperty(req, function (beforeActivated) {
            if (beforeActivated.length !== 1) {
                console.log(new Error("Error in value of : " + req.query.service_key));
                return;
            }
            hamrahvas.sendSMS(req.query.tel, req.query.scode, beforeActivated[0].value, req.query.service, 0, '00', function (callback) {});
        });
    });
}

function sendFirstContent(req) {
    req.query.service_key = 'content-1';
    service.getProperty(req, function (question) {
        if (question.length === 1) {
            hamrahvas.sendSMS(req.query.tel, req.query.scode, question[0].value, req.query.service, 0, '01', function (callback) {
            });
        }
    });
}

function sendLastContent(req, from) {
    var cnt = jdate.getBetweenDates(from, new Date());
    req.query.service_key = 'content-' + cnt.length;
    service.getProperty(req, function (question) {
        if (question.length === 1) {
            hamrahvas.sendSMS(req.query.tel, req.query.scode, question[0].value, req.query.service, 0, '01', function (callback) {
            });
        }
    });
}