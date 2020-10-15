exports.processRequest = processRequest;

function processRequest(req) {
    var date = require('../../util/jalali').jToday();
    require('../../dao/subscriber').getSubscriber(req, function (sub) {
        // is not subscriber
        if (sub.length === 0) {
            req.query.service_key = 'before de-activation';
            require('../../dao/service').getProp(req, function (shouldBeSubscriber) {
                require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, shouldBeSubscriber, req.query.service, 0, '00', function (callback) {
                    //console.log(date + ':' + callback + ':' + shouldBeSubscriber);
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
            require('../../dao/service').getProp(req, function (deactivation) {
                require('../../mapfa/hamrah-vas').sendSMS(req.query.tel, req.query.scode, deactivation, req.query.service, 41, '00', function (callback) {
                    //console.log(date + ':' + callback + ':' + deactivation);
                });
            });
        });
    });
}