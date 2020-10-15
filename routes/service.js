var express = require('express');
var router = express.Router();
var service = require('../dao/service');

router.get('/', function (req, res, next) {
    res.set('content-type', 'text/html');
    res.render('service.html');
});

router.post('/', function (req, res, next) {
    
    if (req.body.hasOwnProperty('functionality') && req.body.functionality === 'getAll') {
        service.getAll(req, function (callback) {
            res.json(callback);
        });
        return;
    }
    
    if (req.body.hasOwnProperty('functionality') && req.body.functionality === 'get prop') {
        service.getAllProperty(req, function (err, callback) {
            res.json(callback);
        });
        return;
    }
    
    if (req.body.hasOwnProperty('functionality') && req.body.functionality === 'delete prop') {
        service.removeProperty(req, function (err, result) {
            if (err) {
                console.log(result);
                res.writeHead(500);
                res.end();
            }
            res.end();
        });
        return;
    }
    
    if (req.body.hasOwnProperty('functionality') && req.body.functionality === 'add prop') {
        service.addProperty(req, function (err, result) {
            if (err) {
                console.log(result);
                res.writeHead(500);
                res.end();
            }
            res.end(result.toString());
        });
        return;
    }
    
    if (req.body.hasOwnProperty('functionality') && req.body.functionality === 'update prop') {
        service.updateProperty(req, function (err, result) {
            if (err) {
                console.log(result);
                res.writeHead(500);
                res.end();
            }
            res.end();
        });
        return;
    }
    
    if (req.body.hasOwnProperty('functionality') && req.body.functionality === 'add srv') {
        service.addService(req, function (err, result) {
            if (err) {
                console.log(result);
                res.writeHead(500);
                res.end();
            }
            res.end();
        });
        return;
    }
    
    if (req.body.hasOwnProperty('functionality') && req.body.functionality === 'delete srv') {
        service.deleteService(req, function (err, result) {
            if (err) {
                console.log(result);
                res.writeHead(500);
                res.end();
            }
            res.end();
        });
        return;
    }
    
    if (req.body.hasOwnProperty('functionality') && req.body.functionality === 'srv type') {
        service.getServiceType(req, function (err, result) {
            if (err) {
                console.log(result);
                res.writeHead(500);
                res.end();
            }
            res.json(result);
        });
        return;
    }
    
    return next(new Error("Invalid parameters!!!"));
});

module.exports = router;