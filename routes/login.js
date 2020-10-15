var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session.user_id) {
        res.redirect('/home');
        return;
    }
    //res.status(500);
    res.set('content-type', 'text/html');
    res.render('login.html');
});

router.post('/', function(req, res, next) {
    if (req.session.user_id) {
        res.send(true);
        return;
    }
    if (typeof req.body.user === "undefined" || typeof req.body.password === "undefined") {
        return next(new Error("Invalid parameters!!!"));
    }
    require('../dao/user').checkingUser(req, next, function(results) {
        res.send(results);
    });
});

module.exports = router;