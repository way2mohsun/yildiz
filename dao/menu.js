exports.headMenu = headMenu;
exports.subMenu = subMenu;

function headMenu(req, callback) {
    var query = "select m.id, m.`name`, m.`path` from menu m, `user` u, user_menu um " +
            "where m.status = 'true' and u.status = 'true' and um.status = 'true' and " +
            "u.id = um.user_id and um.menu_id = m.id " +
            "and father = 0 and u.id = " + req.session.user_id;
    
    req.getConnection(function (err, connection) {
        if (err)
            callback(true);
        res = connection.query(query);
        res.on('error', function (err) {
            callback(true);
        });
        var results = [];
        res.on('result', function (result) {
            results.push(result);
        });
        res.on('end', function (result) {
            if (results.length < 1) {
                callback(true);
            } else {
                callback(false, results);
            }
        });
        
    });
}

function subMenu(req, callback) {
    
    var query = "select m.id, m.`name`, m.`path`, m.father from menu m, `user` u, user_menu um " +
            "where m.status = 'true' and u.status = 'true' and um.status = 'true' and " +
            "u.id = um.user_id and um.menu_id = m.id " +
            "and father <> 0 and u.id = " + req.session.user_id;
    
    req.getConnection(function (err, connection) {
        if (err)
            callback(true);
        connection.query(query);
        res = connection.query(query);
        res.on('error', function (err) {
            callback(true);
        });
        var results = [];
        res.on('result', function (result) {
            results.push(result);
        });
        res.on('end', function () {
            var path = [];
            for (var i in results) {
                path.push(results[i].path);
            }
            req.session.access = path;
            callback(false, results);
        });
    });
}
