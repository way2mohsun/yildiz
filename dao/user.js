exports.checkingUser = checkingUser;

function checkingUser(req, next, callback) {
    var query = "select * from user where user = ? and password = ? and status = 'true'";
    req.getConnection(function (err, connection) {
        if (err) {
            callback(false);
            return next(new Error("Error in Connection !!!"));
        }
        res = connection.query(query, [req.body.user, req.body.password]);
        res.on('error', function (err) {
            callback(false);
            return next(new Error("Error in Query !!!" + query));
        });
        var results = [];
        res.on('result', function (result) {
            results.push(result);
        });
        res.on('end', function () {
            if (results.length < 1) {
                callback(false);
            } else {
                req.session.user_id = results[0].id;
                callback(true);
            }
        });
    });
}