exports.getSubscriber = getSubscriber;
exports.getSubscriberByDate = getSubscriberByDate;
exports.getSubscriber4PanelTajmi = getSubscriber4PanelTajmi;
exports.getSubscribers = getSubscribers;
exports.getActiveService = getActiveService;
exports.setSubscriber = setSubscriber;
exports.setUnSubscriber = setUnSubscriber;
exports.setUnSubscriberFromPanel = setUnSubscriberFromPanel;

exports.getAll = function () {

};

function getSubscriber(req, callback) {
    var service = req.query.head_service_id === null ? req.query.service_id : req.query.head_service_id;
    var query = "select * from subscriber where un_reg is null and tel = " + req.query.tel + " and service_id = " + service;
    req.getConnection(function (err, connection) {
        connection.query(query, function (err, results) {
            if (typeof results === "undefined" || err) {
                console.log(new Error("Error in Query : " + query));
            }
            callback(results);
        });
    });
}

exports.getSubscriberPerShortCode = function (req, callback) {
    var query = "SELECT su.* FROM subscriber su, service s \
        WHERE s.id = su.service_id and su.un_reg is null and s.receive_scode = " + req.query.scode + " and su.tel = " + req.query.tel;
    req.getConnection(function (err, connection) {
        connection.query(query, function (err, results) {
            if (typeof results === "undefined" || err) {
                console.log(new Error("Error in Query : " + query));
            }
            callback(results);
        });
    });
};

function getSubscriberByDate(req, callback) {

    var query = "select * from subscriber sub, service srv " +
            " where tel = " + req.query.tel +
            (req.query.service_id === null ? "" : " and srv.service_id = " + req.query.service_id) +
            " and srv.id = sub.service_id " +
            " and date(reg) >= '" + req.body.from + "' and date(reg) <= '" + req.body.to + "'";
    //console.log(query);
    req.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            callback(true);
            return;
        }
        res = connection.query(query, [req.body.user, req.body.password]);
        res.on('error', function (err) {
            console.log(err);
            callback(true);
            return;
        });
        var results = [];
        res.on('result', function (result) {
            results.push(result);
        });
        res.on('end', function () {
            callback(false, results);
        });
    });
}

function getSubscriber4PanelTajmi(req, callback) {

    var query = "select * from history sub, service srv \
             where tel = ? \
             and srv.id = sub.service_id ";

    req.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            callback(true);
            return;
        }
        res = connection.query(query, [req.query.tel]);
        res.on('error', function (err) {
            console.log(err);
            callback(true);
            return;
        });
        var results = [];
        res.on('result', function (result) {
            results.push(result);
        });
        res.on('end', function () {
            callback(false, results);
        });
    });
}

function getSubscribers(req, callback) {
    var service = req.query.head_service_id === null ? req.query.service_id : req.query.head_service_id;
    var query = "select * from subscriber where un_reg is null and service_id = " + service;
    req.getConnection(function (err, connection) {
        if (err) {
            console.log(new Error(err));
        }
        connection.query(query, function (err, results) {
            if (err) {
                console.log(new Error("Error in Query : " + query));
            }
            callback(results);
        });
    });
}

function setSubscriber(req, callback) {
    var service = req.query.head_service_id === null ? req.query.service_id : req.query.head_service_id;
    var query = "SELECT * FROM subscriber WHERE tel = " + req.query.tel + " and service_id = " + service;
    req.getConnection(function (err, connection) {
        if (err) {
            console.log(new Error("Error in Connection"));
            callback({});
            return;
        }
        connection.query(query, function (err, last) {
            if (typeof last === "undefined" || err) {
                console.log(new Error("Error in Query : " + query));
                return;
            }
            if (last.length > 0) {
                query = "UPDATE subscriber SET un_reg = null WHERE tel = " + req.query.tel + " and service_id = " + service;
                connection.query(query, function (err, update) {
                    if (typeof update === "undefined" || err) {
                        console.log(new Error("Error in Query : " + query));
                        return;
                    }
                    callback({sub: last[0].id, reactivation: true, reg_date: last[0].reg});
                });
                return;
            }
            query = "insert into subscriber (tel, service_id) values (" + req.query.tel + "," + service + ")";
            req.getConnection(function (err, connection) {
                connection.query(query, function (err, sub) {
                    if (typeof sub === "undefined" || err) {
                        console.log(new Error("Error in Query : " + query));
                    }
                    callback({sub: sub.insertId, reactivation: false});
                });
            });
        });
    });
}

function setUnSubscriber(req, callback) {
    var service = req.query.head_service_id === null ? req.query.service_id : req.query.head_service_id;
    var query = "update subscriber set un_reg = now() where tel = " + req.query.tel + " and service_id = " + service;
    req.getConnection(function (err, connection) {
        connection.query(query, function (err, results) {
            if (typeof results === "undefined" || err) {
                console.log(new Error("Error in Query : " + query));
            }
            callback(results);
        });
    });
}

function setUnSubscriberFromPanel(req, callback) {
    var query = "UPDATE subscriber s JOIN service srv ON s.service_id = srv.id " +
            " AND srv.service_id = " + req.query.service_id +
            " AND s.tel = " + req.query.tel +
            " AND s.un_reg IS NULL " +
            " SET s.un_reg = NOW()";
    req.getConnection(function (err, connection) {
        connection.query(query, function (err, results) {
            if (typeof results === "undefined" || err) {
                console.log(new Error("Error in Query : " + query));
            }
            callback(results);
        });
    });
}

function getActiveService(req, callback) {
    var query = "SELECT srv.`name`, srv.service_id, srv.scode FROM subscriber sub, service srv \
            WHERE tel = ? AND un_reg IS NULL AND sub.service_id = srv.id \
            AND srv.status = 'true'";
    req.getConnection(function (err, connection) {
        connection.query(query, [req.query.tel], function (err, results) {
            if (typeof results === "undefined" || err) {
                console.log(new Error("Error in Query : " + query));
            }
            callback(results);
        });
    });
}