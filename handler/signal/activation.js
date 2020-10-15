exports.processRequest = processRequest;

function processRequest(req) {
    require('../../dao/subscriber').getSubscriber(req, function (sub) {
        if (sub.length === 0) {
            require('../../dao/questionnaire').setNewTransaction(req, function (tr) {
                req.query.subscriber_id = tr.sub;
                if (tr.reactivation === true) {
                    req.query.service_key = 'reactivation welcome';
                    require('../../dao/service').getProperty(req, function (welcome) {
                        if (welcome.length !== 1) {
                            console.log(new Error("Error in value of : " + req.query.service_key));
                            return;
                        }
                        require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, welcome[0].value, req.query.service, 21, '00', function (callback) {
                            //console.log(require('../../util/jalali').jToday() + ':' + callback + ':' + welcome[0].value);
                            setTimeout(function () {
                                lastQuestion(req);
                            }, 3000);
                        });
                    });
                } else {
                    req.query.service_key = 'welcome';
                    require('../../dao/service').getProperty(req, function (welcome) {
                        if (welcome.length !== 1) {
                            console.log(new Error("Error in value of : " + req.query.service_key));
                            return;
                        }
                        require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, welcome[0].value, req.query.service, 21, '00', function (callback) {
                            //console.log(require('../../util/jalali').jToday() + ':' + callback + ':' + welcome[0].value);
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
        require('../../dao/service').getProperty(req, function (beforeActivated) {
            if (beforeActivated.length !== 1) {
                console.log(new Error("Error in value of : " + req.query.service_key));
                return;
            }
            require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, beforeActivated[0].value, req.query.service, 0, '00', function (callback) {
                //console.log(require('../../util/jalali').jToday() + ':' + callback + ':' + beforeActivated[0].value);
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
        req.query.service_key = 'question-' + (questionnaire[0].answer_count + 1);
        require('../../dao/service').getProperty(req, function (question) {
            if (question.length !== 1) {
                req.query.service_key = 'no question has remained';
                require('../../dao/service').getProperty(req, function (noQuestion) {
                    if (noQuestion.length !== 1) {
                        console.log(new Error("Error in value of : " + req.query.service_key));
                        return;
                    }
                    require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, noQuestion[0].value, req.query.service, 0, '00', function (callback) {
                        //console.log(require('../../util/jalali').jToday() + ':' + callback + ':' + noQuestion[0].value);
                    });
                });
            } else {
                require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, question[0].value, req.query.service, 0, '01', function (callback) {
                    //console.log(require('../../util/jalali').jToday() + ':' + callback + ':' + question[0].value);
                });
            }
        });
    });
}