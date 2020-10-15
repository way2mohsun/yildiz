exports.getHandler = getHandler;
exports.getGeneralOff = getGeneralOff;
exports.getAll = getAll;
exports.getProperty = getProperty;
exports.getAllProperty = getAllProperty;
exports.removeProperty = removeProperty;
exports.updateProperty = updateProperty;
exports.addProperty = addProperty;
exports.addService = addService;
exports.getProp = getProp;
exports.getQuestion = getQuestion;
exports.getHeadProperty = getHeadProperty;
exports.getMotivation = getMotivation;
exports.getService = getService;
exports.getUnsubscribeMessageBySeriveID = getUnsubscribeMessageBySeriveID;
exports.getServiceNames = getServiceNames;
exports.deleteService = deleteService;
exports.getServiceType = getServiceType;

exports.getServiceByName = function (req, calback) {
    var query = "SELECT * from service WHERE `name` = ? and status = 'true'";
    req.getConnection(function (err, connection) {
        if (err) {
            console.log("Error in Connection !!!");
            calback(true);
        }
        res = connection.query(query, [req.query.service_name]);
        res.on('error', function (err) {
            console.log(new Error("Error in Query : " + query));
            calback(true);
        });
        var results = [];
        res.on('result', function (result) {
            results.push(result);
        });
        res.on('end', function () {
            if (results.length === 1) {
                req.query.service_id = results[0].id;
                req.query.head_service_id = results[0].head;
                calback(false);
            } else {
                calback(true);
            }
        });
    });
};

function getHandler(req, callback) {
    var text = decodeURIComponent(req.query.text);
    var scode = req.query.scode;
    var tel = Number(req.query.sender);
    var query = "SELECT service.*, `handler` FROM service, service_type " +
            "WHERE '" + text + "' REGEXP promotion " +
            "AND   '" + scode + "' REGEXP receive_scode " +
            "AND   service.type = service_type.id " +
            "AND   status = 'true'";
    //console.log(query);
    req.getConnection(function (err, connection) {
        if (err) {
            console.log(new Error("Error in Connection"));
            callback({});
            return;
        }
        connection.query(query, function (err, results) {
            if (typeof results === "undefined" || err) {
                console.log(new Error("Error in Query : " + query));
                callback({});
                return;
            }
            callback(results);
        });
    });
}

function getGeneralOff(req, callback) {
    console.log('getGeneralOff');
}

function getAll(req, callback) {
    var query =
            "SELECT s.id, s.`name`, t.`name` `type`, promotion, receive_scode, head, comment, s.service_id \
            from service s, service_type t \
            WHERE s.`type` = t.id AND s.status = 'true'";
    req.getConnection(function (err, connection) {
        if (err) {
            console.log(new Error("Error in Connection"));
            callback({});
            return;
        }
        connection.query(query, function (err, results) {
            if (typeof results === "undefined" || err) {
                console.log(new Error("Error in query : " + query));
            }
            callback(results);
        });
    });
}

function getProperty(req, callback) {
    var service = req.query.head_service_id === null ? req.query.service_id : req.query.head_service_id;
    var query = "select * from service_prop where service_id = " + service
            + " AND `key` LIKE '" + req.query.service_key + "'";
    //console.log(query);
    req.getConnection(function (err, connection) {
        if (err) {
            console.log(new Error("Error in Connection"));
            callback({});
            return;
        }
        connection.query(query, function (err, results) {
            if (typeof results === "undefined" || results.length < 1 || err) {
                console.log(new Error("Error in result : " + req.query.service_key));
                callback({});
                return;
            }
            callback(results);
        });
    });
}

function getAllProperty(req, callback) {
    var query = "select * from service_prop where service_id = ?";
    req.getConnection(function (err, connection) {
        if (err)
            return callback(true);
        res = connection.query(query, [req.body.id]);
        res.on('error', function (err) {
            return callback(true);
        });
        var results = [];
        res.on('result', function (result) {
            results.push(result);
        });
        res.on('end', function () {
            return callback(false, results);
        });
    });
}

function removeProperty(req, callback) {
    var query = "delete from service_prop where id = ?";
    req.getConnection(function (err, connection) {
        if (err)
            return callback(true, err);
        res = connection.query(query, [req.body.id]);
        res.on('error', function (err) {
            return callback(true, err);
        });
        res.on('result', function (result) {
            if (result.affectedRows !== 1) {
                return callback(true, 'For id : ' + req.body.id + ' has affectedRows : ' + result.affectedRows);
            }
            return callback(false);
        });
        res.on('end', function () {
        });
    });
}

function updateProperty(req, callback) {
    var query = "update service_prop set value = ? where id = ?";
    req.getConnection(function (err, connection) {
        if (err)
            return callback(true, err);
        res = connection.query(query, [req.body.value, req.body.id]);
        res.on('error', function (err) {
            return callback(true, err);
        });
        res.on('result', function (result) {
            if (result.affectedRows !== 1) {
                return callback(true, 'For id : ' + req.body.id + ' has affectedRows : ' + result.affectedRows);
            }
            return callback(false);
        });
        res.on('end', function () {
        });
    });
}

function addProperty(req, callback) {
    
    var query = "insert into service_prop (service_id, `key`, `value`) values (?,?,?)";
    
    req.getConnection(function (err, connection) {
        if (err)
            return callback(true, err);
        res = connection.query(query, [req.body.service, req.body.key, req.body.value]);
        res.on('error', function (err) {
            return callback(true, err);
        });
        res.on('result', function (result) {
            if (result.affectedRows !== 1) {
                return callback(true, 'For id : ' + req.body.id + ' has affectedRows : ' + result.affectedRows);
            }
            return callback(false, result.insertId);
        });
        res.on('end', function () {
        });
    });
}

function addService(req, callback) {
    
    var query = "INSERT INTO service(`name`,`type`,promotion,receive_scode,scode,service_id,comment,head) values (?,?,?,?,?,?,?,?)";
    
    req.getConnection(function (err, connection) {
        if (err)
            return callback(true, err);
        res = connection.query(query, [req.body.service, req.body.key, req.body.value]);
        res.on('error', function (err) {
            return callback(true, err);
        });
        res.on('result', function (result) {
            if (result.affectedRows !== 1) {
                return callback(true, result.affectedRows);
            }
            return callback(false, result.insertId);
        });
        res.on('end', function () {
        });
    });
}

function getProp(req, callback) {
    var service = req.query.head_service_id === null ? req.query.service_id : req.query.head_service_id;
    var query = "select * from service_prop where service_id = " + service
            + " AND `key` LIKE '" + req.query.service_key + "'";
    //console.log(query);
    req.getConnection(function (err, connection) {
        if (err) {
            console.log(new Error("Error in Connection"));
            callback(null);
            return;
        }
        connection.query(query, function (err, results) {
            if (typeof results === "undefined" || results.length !== 1 || err) {
                console.log(new Error("Error in result : " + req.query.service_key));
                callback(null);
                return;
            }
            callback(results[0].value);
        });
    });
}

function getQuestion(req, callback) {
    var service = req.query.head_service_id === null ? req.query.service_id : req.query.head_service_id;
    var query = "select * from service_prop where service_id = " + service
            + " AND `key` LIKE 'question-%'";
    //console.log(query);
    req.getConnection(function (err, connection) {
        if (err) {
            console.log(new Error("Error in Connection"));
            callback({});
            return;
        }
        connection.query(query, function (err, results) {
            if (typeof results === "undefined" || results.length < 1 || err) {
                console.log(new Error("Error in result : " + req.query.service_key));
                callback({});
                return;
            }
            callback(results);
        });
    });
}

function getMotivation(req, callback) {
    var motive;
    if (req.query.isCorrect === 'true') {
        motive = 'correct-motivation';
    } else {
        motive = 'wrong-motivation';
    }
    var service = req.query.head_service_id === null ? req.query.service_id : req.query.head_service_id;
    var query = "select * from service_prop where service_id = " + service
            + " AND `key` = '" + motive + "' order by rand() limit 1";
    req.getConnection(function (err, connection) {
        if (err) {
            console.log(new Error("Error in Connection"));
            callback({});
            return;
        }
        connection.query(query, function (err, results) {
            if (typeof results === "undefined" || results.length > 1 || results.length < 1 || err) {
                console.log(new Error("Error in result : " + req.query.service_key));
                callback({});
                return;
            }
            callback(results);
        });
    });
}

function getHeadProperty(req, callback) {
    var query = "select * from service_prop where service_id = " + req.query.head_service_id
            + " and `key` = '" + req.query.service_key + "'";
    req.getConnection(function (err, connection) {
        if (err) {
            console.log(new Error("Error in Connection"));
            callback({});
            return;
        }
        connection.query(query, function (err, results) {
            if (typeof results === "undefined" || results.length > 1 || err) {
                console.log(new Error("Error in Query : " + query));
                callback({});
                return;
            }
            callback(results);
        });
    });
}

function getService(req, callback) {
    var query = "SELECT * from service WHERE `name` = '" + req.query.service_name + "' and status = 'true'";
    req.getConnection(function (err, connection) {
        if (err) {
            console.log(new Error("Error in Connection"));
            return;
        }
        connection.query(query, function (err, results) {
            if (results.length < 1 || err) {
                console.log(new Error("Error in Query : " + query));
                return;
            }
            req.query.service_id = results[0].id;
            req.query.head_service_id = results[0].head;
            callback(results);
        });
    });
}

function getServiceNames(req, callback) {
    var query = "select `name`, service_id, comment, id from service where head is null ";
    req.getConnection(function (err, connection) {
        if (err)
            return console.log(new Error("Error in Connection"));
        connection.query(query, function (err, results) {
            callback(results);
        });
    });
}

function getUnsubscribeMessageBySeriveID(req, callback) {
    var query = "SELECT sp.`value`, s.scode FROM service s, service_prop sp \
        WHERE s.id = sp.service_id and s.service_id = ? and sp.`key` = 'de-activation'";

    req.getConnection(function (err, connection) {
        if (err)
            return callback(true, err);
        res = connection.query(query, [req.query.service_id]);
        res.on('error', function (err) {
            return callback(true, err);
        });
        res.on('result', function (result) {
            return callback(false, result.value, result.scode);
        });
        res.on('end', function () {
        });
    });
}

function deleteService(req, callback) {
    var query = "update service set status = 'false' where id = ?";

    req.getConnection(function (err, connection) {
        if (err)
            return callback(true, err);
        res = connection.query(query, [req.body.service]);
        res.on('error', function (err) {
            return callback(true, err);
        });
        res.on('result', function (result) {
            return callback(false, result.affectedRows);
        });
        res.on('end', function () {
        });
    });
}

function getServiceType(req, callback) {
    var query = "SELECT id, `name`, `handler` FROM service_type";

    req.getConnection(function (err, connection) {
        if (err)
            return callback(true, err);
        res = connection.query(query, [req.body.service]);
        res.on('error', function (err) {
            return callback(true, err);
        });
        var results = [];
        res.on('result', function (result) {
            results.push(result);
        });
        res.on('end', function () {
            return callback(false, results);
        });
    });
}
