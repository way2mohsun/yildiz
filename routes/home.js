var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.set('content-type', 'text/html');
    res.render('home.html');
});

router.post('/', function(req, res, next) {

    if (typeof req.body.username !== "undefined" && typeof req.body.password !== "undefined") {
        res.set('content-type', 'text/html');
        res.render('home.html');
        return;
    }
    
    if (typeof req.body.functionality !== "undefined" && req.body.functionality === 'getMenu') {
        var HashMap = require('hashmap').HashMap;
        var head = new HashMap();
        //var detail = new HashMap();
        require('../dao/menu').headMenu(req, function(err, results) {
            var ob;
            for (var i in results) {
                ob = new Object();
                ob.id = results[i].id;
                ob.name = results[i].name;
                //ob.path = results[i].path; no need
                ob.detail = [];
                head.set(ob.id, ob);
            }
            require('../dao/menu').subMenu(req, function(err, results) {
                var ob;
                for (var i in results) {
                    ob = new Object();
                    ob.id = results[i].id;
                    ob.name = results[i].name;
                    ob.path = results[i].path;
                    ob.father = results[i].father;
                    if (head.has(results[i].father))
                        head.get(results[i].father).detail.push(ob);
                }
                var menu = [];
                head.forEach(function(value, key) {
                    menu.push(value);
                });
                //console.log(JSON.stringify(menu));
                res.json(menu);
            });
        });
        return;
    }
    return next(new Error("Invalid parameters!!!"));
});

module.exports = router;