var express = require('express');
var router = express.Router();
var hamrahvas = require('../mapfa/hamrah-vas');
var off = 'مشترک گرامی، شما عضو سرویس SERVICE هستید. در صورت تمایل به غیرفعالسازی کلمه off یا خاموش را به SCODE ارسال نمایید.';

router.get('/', function (req, res, next) {
    var query = "SELECT * FROM service WHERE status = 'true' and head is null group BY service_id";
    req.getConnection(function (err, connection) {
        if (err) {
            return next(new Error("Error in Connection !!!"));
        }
        var rs = connection.query(query);
        rs.on('error', function (err) {
            return next(new Error("Error in Query !!!" + query));
        });
        rs.on('result', function (result) {
            sedOffPerService(req, next, result.service_id, result.scode, res);
        });
        rs.on('end', function () {
        });
    });
});

function sedOffPerService(req, next, service_id, scode, res) {

    var query = "SELECT srv.comment name, sub.tel \
                FROM subscriber sub, service srv \
                WHERE srv.id = sub.service_id \
                AND sub.un_reg is null \
                AND srv.service_id = " + service_id;

    req.getConnection(function (err, connection) {
        if (err)
            return next(new Error("Error in Connection !!!"));
        var rs = connection.query(query, [req.body.user, req.body.password]);
        rs.on('error', function (err) {
            return next(new Error("Error in Query !!!" + query));
        });
        var sub = [];
        var txt = [];
        var counter = 0;
        rs.on('result', function (result) {
            counter++;
            sub.push(result.tel);
            txt.push(off.replace('SERVICE', result.name).replace('SCODE', scode));
            if (counter === 90) {
                hamrahvas.sendSMS(sub, scode, txt, service_id, 0, '00', function (callback) {});
                counter = 0;
                sub = [];
                txt = [];
            }
        });
        rs.on('end', function () {
            if (counter !== 0) {
                hamrahvas.sendSMS(sub, scode, txt, service_id, 0, '00', function (callback) {});
            }
            res.end();
        });
    });
}

module.exports = router;