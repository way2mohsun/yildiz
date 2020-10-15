var cron = require('cron').CronJob;
exports.getAll = getAll;
exports.getHistory = getHistory;
exports.get = get;
exports.create = create;
exports.find = find;
exports.edit = edit;
exports.del = del;

function edit(req, callback) {
    var query = "UPDATE scheduler SET " +
            " startup = '" + req.body.startup_date + " " + req.body.startup_time + "', " +
            " short_code = '" + req.body.short_code + "' ," +
            " message = '" + req.body.message + "' ," +
            " username = '" + req.body.username + "' ," +
            " password = '" + req.body.password + "' ," +
            " domain = '" + req.body.domain + "' ," +
            " service_key = '" + req.body.service_key + "'" +
            "   WHERE user_id = " + req.session.user_id + " AND id = " + req.body.id;
    req.getConnection(function (err, connection) {
        if (err)
            callback({});
        connection.query(query, function (err, results) {
            if (err)
                callback({});
            callback(results);
        });
    });
}

function getAll(req, callback) {
    var query = "SELECT * FROM scheduler WHERE status = 'true' and user_id = " + req.session.user_id + " ORDER BY startup";
    req.getConnection(function (err, connection) {
        if (err)
            callback({});
        connection.query(query, function (err, results) {
            if (typeof results === "undefined") {
                callback({});
            }
            if (err) {
                callback({});
            }
            callback(results);
        });
    });
}

function getHistory(req, callback) {
    var query = "SELECT * FROM scheduler WHERE status = 'false' and user_id = " + req.session.user_id + " ORDER BY startup desc";
    //console.log(query);
    req.getConnection(function (err, connection) {
        if (err)
            callback({});
        connection.query(query, function (err, results) {
            if (typeof results === "undefined") {
                callback({});
            }
            if (err) {
                callback({});
            }
            callback(results);
        });
    });
}

function get(req, callback) {
    var query = "SELECT * FROM scheduler WHERE " +
            " status = 'true' and " +
            " user_id = " + req.session.user_id + " and " +
            " id = " + req.body.id +
            " ORDER BY startup";
    req.getConnection(function (err, connection) {
        if (err)
            callback({});
        connection.query(query, function (err, results) {
            if (typeof results === "undefined") {
                callback({});
            }
            if (err) {
                callback({});
            }
            callback(results);
        });
    });
}

function create(fields, req, callback) {
    var query = "INSERT INTO scheduler (user_id, startup, short_code, service_key, username, password, domain, message)  VALUES (" +
            req.session.user_id + "," +
            "'" + fields["startup-date"][0] + " " + fields["startup-time"][0] + "'," +
            "'" + fields["short-code"][0] + "'," +
            "'" + fields["service-key"][0] + "'," +
            "'" + fields["username"][0] + "'," +
            "'" + fields["password"][0] + "'," +
            "'" + fields["domain"][0] + "'," +
            "'" + fields["message"][0] + "')";
    req.getConnection(function (err, connection) {
        if (err)
            callback({});
        connection.query(query, function (err, results) {
            if (err)
                callback({});
            callback(results);
        });
    });
}

function del(req, callback) {
    var query = "UPDATE scheduler SET status = 'delete' WHERE user_id = " + req.session.user_id + " AND id = " + req.body.id;
    req.getConnection(function (err, connection) {
        if (err)
            callback({});
        connection.query(query, function (err, results) {
            if (err)
                callback({});
            callback(results);
        });
    });
}

function find(callback) {
    var mysql = require('mysql');
    var connProp = JSON.parse(require('fs').readFileSync(__dirname + '/../package.json', 'utf8')).ConnectionProperty;
    var job = new cron('*/20 * * * * *', function () {
        var conn = mysql.createConnection(connProp);
        conn.connect();
        conn.query("SELECT * FROM scheduler WHERE status = 'true' and now() > startup", function (err, results, fields) {
            if (err) {
                console.log(err);
                conn.end();
                return;
            }
            for (var i in results) {
                conn.query("UPDATE scheduler SET status = 'false' WHERE id = " + results[i].id, function (e, r, s) {
                    if (e) {
                        console.log(e);
                        conn.end();
                        return;
                    }
                });
                require('../mapfa/bulk').send(
                        results[i].username,
                        results[i].password,
                        results[i].domain,
                        results[i].short_code,
                        results[i].service_key,
                        results[i].message,
                        results[i].id);
            }
            conn.end();
        });
    }, function () {
        // This function is executed when the job stops
    }, true);
    return callback(job);
}