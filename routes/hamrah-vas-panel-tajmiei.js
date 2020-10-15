var express = require('express');
var router = express.Router();
var service = require('../dao/service');
var hamrahvas = require('../mapfa/hamrah-vas');
var date = require('../util/jalali');

router.post('/', function (req, res, next) {
    if (!req.body.hasOwnProperty('tel')) {
        res.json(new Array("-4"));
        return;
    }
    if (isNaN(req.body.tel)) {
        res.json(new Array("mobileNum should be digit"));
        return;
    }
    req.query.tel = '98' + Number(req.body.tel);
    var sub = require('../dao/subscriber');
    if (req.body.fun === "unsubscribe") {
        if (isNaN(req.body.service)) {
            res.json(new Array("-5"));
            return;
        }
        req.query.service_id = Number(req.body.service);
        sub.setUnSubscriberFromPanel(req, function (sub) {
            if (sub.affectedRows === 0) {
                res.end("-4");
            } else {
                service.getUnsubscribeMessageBySeriveID(req, function (err, message, scode) {
                    if (err)
                        return console.log(message);
                    else
                        hamrahvas.sendSMS(req.query.tel, scode, message, req.query.service_id, 0, '00', function (callback) {
                            res.end('0');
                        });
                });
            }
        });
        return;
    }
    if (req.body.fun === "getActiveServices") {
        var out = [];
        sub.getActiveService(req, function (result) {
            if (result.length < 1) {
                res.json(new Array());
                return;
            }
            for (var i in result) {
                out.push(result[i].service_id + ':' + result[i].name);
            }
            res.json(out);
        });
        return;
    }
    if (req.body.fun === "getHistoryServicesAll") {
        var out = [];
        sub.getSubscriber4PanelTajmi(req, function (err, result) {
            if (err) 
                return next(new Error("Error on SQL"));
            if (result.length < 1) {
                res.json(new Array());
                return;
            }
            for (var i in result) {
                try {
                    result[i].regTime = result[i].reg.getHours() + '-' + result[i].reg.getMinutes();
                    result[i].reg = date.g2j4IntegratedPanel(result[i].reg.getFullYear() + '-' + (Number(result[i].reg.getMonth()) + 1) + '-' + result[i].reg.getDate());
                    if (result[i].un_reg !== null) {
                        result[i].un_regTime = result[i].un_reg.getHours() + '-' + result[i].un_reg.getMinutes();
                        result[i].un_reg = date.g2j4IntegratedPanel(result[i].un_reg.getFullYear() + '-' + (Number(result[i].un_reg.getMonth()) + 1) + '-' + result[i].un_reg.getDate());
                        out.push(result[i].service_id + ':' + result[i].reg + ':' + result[i].regTime + ':1:' + result[i].un_reg + ':' + result[i].un_regTime + ':1');
                    } else {
                        out.push(result[i].service_id + ':' + result[i].reg + ':' + result[i].regTime + ':1:::');
                    }
                } catch (err) {
                    console.log(err);
                    res.json(new Array("-3"));
                }
            }
            res.json(out);
        });
        return;
    }
    if (req.body.fun === "getHistoryServicesAll-backup") {
        var validate = require('../util/validate');
        if (!validate.dateFormat(req.body.from) || !validate.dateFormat(req.body.to)) {
            res.json(new Array("Date Format error"));
            return;
        }
        if (typeof req.body.service === 'undefined' || req.body.service === '' || req.body.service === null || req.body.service === 'null') {
            req.query.service_id = null;
        } else {
            if (isNaN(req.body.service)) {
                res.json(new Array("-5"));
                return;
            }
            req.query.service_id = Number(req.body.service);
        }
        var out = [];
        req.body.from = date.j2g(req.body.from);
        req.body.to = date.j2g(req.body.to);
        sub.getSubscriberByDate(req, function (err, result) {
            if (err) {
                return next(new Error("Error on SQL"));
            }
            if (result.length < 1) {
                res.json(new Array("-4"));
                return;
            }
            for (var i in result) {
                try {
                    result[i].regTime = result[i].reg.getHours() + '-' + result[i].reg.getMinutes();
                    result[i].reg = date.g2j(result[i].reg.getFullYear() + '-' + (Number(result[i].reg.getMonth()) + 1) + '-' + result[i].reg.getDate());
                    if (result[i].un_reg !== null) {
                        result[i].un_regTime = result[i].un_reg.getHours() + '-' + result[i].un_reg.getMinutes();
                        result[i].un_reg = date.g2j(result[i].un_reg.getFullYear() + '-' + (Number(result[i].un_reg.getMonth()) + 1) + '-' + result[i].un_reg.getDate());
                        out.push(result[i].service_id + ':' + result[i].reg + ':' + result[i].regTime + ':1:' + result[i].un_reg + ':' + result[i].un_regTime + ':1');
                    } else {
                        out.push(result[i].service_id + ':' + result[i].reg + ':' + result[i].regTime + ':1:::');
                    }
                } catch (err) {
                    console.log(err);
                    res.json(new Array("-3"));
                }
            }
            res.json(out);
        });
        return;
    }
    res.json(new Array("-3"));
});

module.exports = router;