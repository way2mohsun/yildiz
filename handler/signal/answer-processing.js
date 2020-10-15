exports.processRequest = processRequest;

function processRequest(req) {
    require('../../dao/subscriber').getSubscriber(req, function (sub) {
        // is not subscriber
        if (sub.length === 0) {
            req.query.service_key = 'should be subscriber';
            require('../../dao/service').getProperty(req, function (shouldBeSubscriber) {
                if (shouldBeSubscriber.length !== 1) {
                    console.log(new Error("Error in value of : " + req.query.service_key));
                    return;
                }
                require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, shouldBeSubscriber[0].value, req.query.service, 0, '00', function (callback) {
                    //console.log(require('../../util/jalali').jToday() + ':' + callback + ':' + shouldBeSubscriber[0].value);
                });
            });
            return;
        }
        req.query.subscriber_id = sub[0].id;
        require('../../dao/questionnaire').getTransaction(req, function (transaction) {
            require('../../dao/questionnaire').getQuestionCount(req, function (count) {
                if (count[0].count === transaction[0].answer_count) {
                    req.query.service_key = 'no question has remained';
                    require('../../dao/service').getProperty(req, function (noQuestion) {
                        if (noQuestion.length !== 1) {
                            console.log(new Error("Error in value of : hear : " + req.query.service_key));
                            return;
                        }
                        require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, noQuestion[0].value, req.query.service, 0, '00', function (callback) {
                            //console.log(require('../../util/jalali').jToday() + ':' + callback + ':' + noQuestion[0].value);
                        });
                    });
                } else {
                    req.query.service_key = 'selection';
                    require('../../dao/service').getProperty(req, function (selection) {
                        if (selection.length !== 1) {
                            console.log(new Error("Error in value of : " + req.query.service_key));
                            return;
                        }
                        if (req.query.text.match(selection[0].value) === null) {
                            req.query.service_key = 'wrong-selection';
                            require('../../dao/service').getProperty(req, function (wrong) {
                                if (wrong.length !== 1) {
                                    console.log(new Error("Error in value of : " + req.query.service_key));
                                    return;
                                }
                                require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, wrong[0].value, req.query.service, 0, '00', function (callback) {
                                    ///console.log(require('../../util/jalali').jToday() + ':' + callback + ' : ' + wrong[0].value);
                                });
                            });
                        } else {
                            process(req);
                        }
                    });
                }
            });
        });
    });
}

function process(req) {
    require('../../dao/questionnaire').getTransaction(req, function (questionnaire) {
        if (questionnaire.length !== 1) {
            console.log(new Error("Error in questionnaire"));
            return;
        }
        req.query.service_key = 'answer-' + (questionnaire[0].answer_count + 1);
        require('../../dao/service').getProperty(req, function (answer) {
            if (answer.length !== 1) {
                console.log(new Error("Error in value of : " + req.query.service_key));
                return;
            }
            var o = req.query.text.match(answer[0].value);
            if (o !== null) {
                req.query.isCorrect = 'true';
            } else {
                req.query.isCorrect = 'false';
            }
            require('../../dao/questionnaire').answer(req);
            req.query.service_key = 'question-' + (questionnaire[0].answer_count + 2);
            require('../../dao/service').getProperty(req, function (question) {
                if (question.length !== 1) {
                    req.query.service_key = 'no question has remained';
                    require('../../dao/service').getProperty(req, function (noQuestion) {
                        //console.log(JSON.stringify(noQuestion));
                        if (noQuestion.length !== 1) {
                            console.log(new Error("Error in value OF : " + req.query.service_key));
                            return;
                        }
                        require('../../dao/service').getMotivation(req, function (motivation) {
                            require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, motivation[0].value + ' \n' + noQuestion[0].value, req.query.service, 0, '00', function (callback) {
                                //console.log(require('../../util/jalali').jToday() + ':' + callback + ':' + motivation[0].value + '\n' + noQuestion[0].value);
                            });
                        });
                    });
                } else {
                    require('../../dao/service').getMotivation(req, function (motivation) {
                        require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, motivation[0].value + ' \n' + question[0].value, req.query.service, 0, '01', function (callback) {
                            //console.log(require('../../util/jalali').jToday() + ':' + callback + ':' + motivation[0].value + '\n' + question[0].value);
                        });
                    });
                }
            });
        });
    });
}







