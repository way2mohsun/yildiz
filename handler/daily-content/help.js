exports.processRequest = processRequest;

var hamrahvas = require('../../mapfa/hamrah-vas');

function processRequest(req) {

    require('../../dao/subscriber').getSubscriberPerShortCode(req, function (sub) {
        if (sub.length === 0) {
            req.query.service_key = 'help4unsubscribe';
            require('../../dao/service').getProperty(req, function (help) {
                if (help.length !== 1) {
                    console.log(new Error("Error in value of : " + req.query.service_key));
                    return;
                }
                hamrahvas.sendSMS(req.query.tel, req.query.scode, help[0].value, req.query.service, 0, '00', function (callback) {
                });
            });
        } else {
            req.query.service_key = 'help4subscribe';
            req.query.head_service_id = sub[0].service_id;
            req.query.service_id = sub[0].service_id;
            var txt = 'مشترک گرامی سرویس های موجود در این سرشماری به شرح زیر میباشد' + '\n';
            require('../../dao/service').getProperty(req, function (help) {
                if (help.length !== 1) {
                    console.log(new Error("Error in value of : " + req.query.service_key));
                    return;
                }
                hamrahvas.sendSMS(req.query.tel, req.query.scode, help[0].value, req.query.service, 0, '00', function (callback) {
                });
            });
        }
    });
}