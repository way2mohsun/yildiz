var express = require('express');
var router = express.Router();
var hamrahvas = require('../mapfa/hamrah-vas');

var off = 'of|oof|stap|khamush|lagv|af|khamoush|laqv|laghve|laqve|cancel|stop|off|OFF|paian|khamoosh|khamosh|agv|AFF|0ff|laghv|حذف|لغو|غیر|پایان|انصراف|خاموش|نمیخوام|توقف|کنسل|نفرستید|نخاستم|نمیخام|نفرست|نخاستیم|فعال|نخواستم|نخواستیم|غیرفعالاف|آف|خاموس|حاموس|حاموش|غیر فعال|بسه|بس|استاپ|لقو|خاموش';

router.get('/', function (req, res, next) {
    if (!req.query.hasOwnProperty('scode') ||
            !req.query.hasOwnProperty('tel') ||
            !req.query.hasOwnProperty('text')) {
        res.status(500);
        res.json('One of the parameters is not valid!!!');
        return;
    }
    req.query.text = req.query.text.trim().toLowerCase().replace(/\\/g, '');// do lower case and eliminate '\' for prevent regex error
    var scode = req.query.scode;
    var tel = req.query.tel;
    require('../dao/service').getHandler(req, function (results) {

        // not found
        if (results.length === 0) {
            //general off
            if (req.query.text.match(off) !== null) {
                require('../handler/general-off').processRequest(req);
                return res.end();
            }
            //help
            if (req.query.text.match('^( )*$') !== null) {
                require('../handler/help').processRequest(req);
                return res.end();
            }
        }
        // more than a found
        if (results.length !== 1) {

            var text = '';
            var tmp_service_id = 0;
            if (scode === '9830568') {
                tmp_service_id = 1666;
                text = 'دوست من پیام ارسالی شما  اشتباه است! برای گرفتن راهنمای دسترسی به سرویس "سیگنال موجود است" یا "عطسه"، یک پیامک خالی و برای غیر فعالسازی خاموش رو به 30568 بفرست!';
            } else 
            if (scode === '98305034') {
                tmp_service_id = 1988;
                text = 'دوست من پیام ارسالی شما  اشتباه است! برای گرفتن راهنمای دسترسی به سرویس ها، یک پیامک خالی به 305034 ارسال کنید.';
            }

            try {
                hamrahvas.sendSMS(tel, scode, text, tmp_service_id, 0, '00', function (callback) {});
            } catch (err) {
                console.log('Error in mo wrong : ' + err);
            }
            res.send();
            return;
        }
        try {
            req.query.service_id = results[0].id;
            req.query.service = results[0].service_id;
            req.query.head_service_id = results[0].head;
            req.query.tel = tel;
            req.query.scode = results[0].scode;
            require(results[0].handler).processRequest(req);
        } catch (err) {
            console.log("Error occurred when calling handler");
        }
        res.end();
    });
});

module.exports = router;