exports.processRequest = processRequest;

function processRequest(req) {
    require('../../dao/subscriber').getSubscriber(req, function (sub) {
        // is not subscriber
        if (sub.length === 0) {
            req.query.service_key = 'before de-activation';
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
        require('../../dao/subscriber').setUnSubscriber(req, function (affectedRows) {
            if (typeof affectedRows === "undefined" || !affectedRows.hasOwnProperty('affectedRows')) {
                console.log(new Error("Error on de-activation"));
                return;
            }
            req.query.service_key = 'de-activation';
            require('../../dao/service').getProperty(req, function (deactivation) {
                if (deactivation.length !== 1) {
                    console.log(new Error("Error in value of : " + req.query.service_key));
                    return;
                }
                require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, deactivation[0].value, req.query.service, 41, '00', function (callback) {
                    //console.log(require('../../util/jalali').jToday() + ':' + callback + ':' + deactivation[0].value);
                });
            });
        });
    });
}