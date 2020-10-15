var hamrahvas = require('../mapfa/hamrah-vas');

exports.processRequest = function (req) {

    var query = "SELECT * FROM service WHERE status = 'true' AND receive_scode RLIKE ? LIMIT 1";

    req.getConnection(function (err, connection) {
        if (err)
            return console.log(err);
        res = connection.query(query, [req.query.scode]);
        res.on('error', function (err) {
            return console.log(err);
        });
        var results = [];
        res.on('result', function (result) {
            results.push(result);
        });
        res.on('end', function () {
            if (results.length < 1)
                return console.log('Off results is empty!');
            findSubscriber(req, results);
        });
    });
};

function findSubscriber(req, service) {

    var query = "SELECT s.id, s.service_id, sp.`key`, sp.`value` FROM subscriber su, service s, service_prop sp WHERE \
                    tel = ? AND \
                    un_reg is null and s.receive_scode = ? and \
                    s.id = su.service_id and s.status = 'true' and sp.service_id = s.id and \
                    (sp.`key` = 'de-activation' OR sp.`key` = 'how to off')";

    req.getConnection(function (err, connection) {
        if (err)
            return console.log(err);
        res = connection.query(query, [req.query.tel, req.query.scode]);
        res.on('error', function (err) {
            return console.log(err);
        });
        var subscribers = [];
        res.on('result', function (subscriber) {
            subscribers.push(subscriber);
        });
        res.on('end', function () {
            if (subscribers.length < 1)
                return hamrahvas.sendSMS(req.query.tel, req.query.scode, "شما در حال حاضر برای این سرشماره سرویس فعالی ندارید", service[0].service_id, 0, '00', function (callback) {});
            if (subscribers.length === 2) // find a serivce with two property
                return doUnSubscriber(req, subscribers);
            var txt = 'مشترک گرامی‌ شما دارای N سرویس فعال می‌باشید.' + '\n' +
                    'برای غیر فعال سازی  ' + '\n';

            var counter = 0;
            for (var k in subscribers) {
                if (subscribers[k].key === 'how to off') {
                    ++counter;
                    txt += counter + '.' + subscribers[k].value + '\n';
                }
            }
            txt = txt.replace('N', counter);
            hamrahvas.sendSMS(req.query.tel, req.query.scode, txt, service[0].service_id, 0, '00', function (callback) {});
        });
    });
}

function doUnSubscriber(req, subscribers) {
    var query = "update subscriber set un_reg = now() where tel = ? AND service_id = ?";
    req.getConnection(function (err, connection) {
        if (err)
            callback(true);
        res = connection.query(query, [req.query.tel, subscribers[0].id]);
        res.on('error', function (err) {
            callback(true);
        });
        res.on('end', function () {
            try {
                var txt = subscribers[0].key === 'de-activation' ? subscribers[0].value : subscribers[1].value;
                hamrahvas.sendSMS(req.query.tel, req.query.scode, txt, subscribers[0].service_id, 0, '00', function (callback) {});
            } catch (e) {
                console.log(e);
            }
        });
    });
}