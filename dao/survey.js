exports.get = function (req, next, callback) {
    var query = "SELECT * FROM scheduler WHERE user_id = ? ORDER BY startup limit 20";
    req.getConnection(function (err, connection) {
        if (err) {
            callback(true);
            return next(new Error("Error in Connection !!!"));
        }
        res = connection.query(query, [req.session.user_id]);
        res.on('error', function (err) {
            callback(true);
            return next(new Error("Error in Query : " + query));
        });
        var results = [];
        res.on('result', function (result) {
            results.push(result);
        });
        res.on('end', function () {
            callback(false, results);
        });
    });
};

exports.set = function (req, callback) {
    var query = "INSERT INTO scheduler (user_id, message, status)  VALUES (?, ?, ?)";
    req.getConnection(function (err, connection) {
        if (err) {
            console.log(new Error("Error in Connection !!!"));
            callback(true);
        }
        res = connection.query(query, [req.session.user_id, req.body.message, 'false']);
        res.on('error', function (err) {
            console.log(new Error("Error in Query : " + query));
            callback(true);
        });
        var results = [];
        res.on('result', function (result) {
            results.push(result);
        });
        res.on('end', function () {
            if(results.affectedRows > 0){
                callback(false);
            } else {
                callback(true);
            }
        });
    });
};

exports.getB = function (req, next, callback) {
    var query = "SELECT * FROM scheduler WHERE user_id = ? ORDER BY startup limit 20";
    req.getConnection(function (err, connection) {
        if (err)
            return next(new Error("Error in Connection"));
        connection.query(query, [req.session.user_id], function (err, results) {
            if (err)
                return next(new Error("Error in Query"));
            callback(results);
        });
    });
};

exports.setB = function (req, next, callback) {
    var query = "INSERT INTO scheduler (user_id, message, status)  VALUES (?, ?, ?)";
    req.getConnection(function (err, connection) {
        if (err)
            return next(new Error("Error in Connection"));
        connection.query(query, [req.session.user_id, req.body.message, 'false'], function (err, results) {
            if (err)
                return next(new Error("Error in Query"));
            callback(results);
        });
    });
};