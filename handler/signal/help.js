exports.processRequest = processRequest;

function processRequest(req) {
    
    require('../../dao/subscriber').getSubscriber(req, function (sub) {
        if (sub.length === 0) {
            req.query.service_key = 'help4unsubscribe';
            require('../../dao/service').getProperty(req, function (help) {
                if (help.length !== 1) {
                    console.log(new Error("Error in value of : " + req.query.service_key));
                    return;
                }
                require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, help[0].value, req.query.service, 0, '00', function (callback) {
                    //console.log(require('../../util/jalali').jToday() + ':' + callback + ':' + help[0].value);
                });
            });
        } else {
            req.query.service_key = 'help4subscribe';
            require('../../dao/service').getProperty(req, function (help) {
                if (help.length !== 1) {
                    console.log(new Error("Error in value of : " + req.query.service_key));
                    return;
                }
                require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, help[0].value, req.query.service, 0, '00', function (callback) {
                    //console.log(require('../../util/jalali').jToday() + ':' + callback + ':' + help[0].value);
                });
            });
        }
    });
}