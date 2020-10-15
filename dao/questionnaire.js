exports.setNewTransaction = setNewTransaction;
exports.setNewDayTransaction = setNewDayTransaction;
exports.getTransaction = getTransaction;
exports.getTransactions = getTransactions;
exports.getQuestionCount = getQuestionCount;
exports.getStats = getStats;
exports.answer = answer;
exports.getSignalExport = getSignalExport;
exports.getWhyQuestions = getWhyQuestions;
exports.setWhyQuestions = setWhyQuestions;
exports.deleteWhyQuestions = deleteWhyQuestions;

function setNewTransaction(req, callback) {
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
                    callback({sub: last[0].id, reactivation: true});
                });
            } else {
                query = "insert into subscriber (tel, service_id) values (" + req.query.tel + "," + service + ")";
                req.getConnection(function (err, connection) {
                    connection.query(query, function (err, sub) {
                        if (typeof sub === "undefined" || err) {
                            console.log(new Error("Error in Query : " + query));
                        }
                        query = "INSERT INTO answer_sheet (subscriber_id) VALUES (" + sub.insertId + ")";
                        connection.query(query, function (err, sheet) {
                            if (typeof sheet === "undefined" || err) {
                                console.log(new Error("Error in Query : " + query));
                                return;
                            }
                            callback({sub: sub.insertId, reactivation: false});
                        });
                    });
                });
            }
        });
    });
}

function setNewDayTransaction(req, callback) {

    var service = req.query.service_id;

    var count = "select count(*) count from service_prop where service_id = " + service
        + " and `key` like 'question-%'";

    var query = "UPDATE answer_sheet a join subscriber s on subscriber_id = s.id " +
        "and un_reg is null " +
        "and answer_count >= (" + count + ") - 1 " +
        "and service_id = " + service + " " +
        "and `date` < CONCAT(date(now()), ' 00:00:00') " +
        "SET `date` = now()";

    req.getConnection(function (err, connection) {
        if (err) {
            console.log(new Error("Error in Connection"));
            callback({});
            return;
        }
        connection.query(query, function (err, setFind) {
            if (typeof setFind === "undefined" || err) {
                console.log(new Error("Error in Query : " + query));
                callback({});
                return;
            }
            query = "UPDATE answer_sheet a join subscriber s on subscriber_id = s.id " +
                "and un_reg is null " +
                    //"and answer_count < (" + count[0].count + ")" +
                "and service_id = " + service + " " +
                "and `date` < CONCAT(date(now()), ' 00:00:00') " +
                "SET answer_count = answer_count + 1";
            connection.query(query, function (err, setNew) {
                if (typeof setNew === "undefined" || err) {
                    console.log(new Error("Error in Query : " + query));
                    callback({});
                    return;
                }
                query = "SELECT s.tel tel ,a.answer_count question " +
                    "FROM subscriber s, answer_sheet a " +
                    "WHERE service_id =  " + service + " " +
                    "AND a.subscriber_id = s.id " +
                    "AND s.un_reg is null " +
                        //"AND answer_count <= (" + count[0].count + ")" +
                    "AND `date` < CONCAT(date(now()), ' 00:00:00')";
                connection.query(query, function (err, results) {
                    if (typeof results === "undefined" || err) {
                        console.log(new Error("Error in Query : " + query));
                        callback({});
                        return;
                    }
                    callback(results);
                });
            });
        });
    });
}

function getTransaction(req, callback) {
    var query = "select * from answer_sheet where subscriber_id = " + req.query.subscriber_id;
    req.getConnection(function (err, connection) {
        if (err) {
            console.log(new Error("Error in Connection"));
            callback({});
            return;
        }
        connection.query(query, function (err, results) {
            if (typeof results === "undefined" || err) {
                console.log(new Error("Error in Query : " + query));
                return;
            }
            callback(results);
        });
    });
}

function getTransactions(req, callback) {
    var query = "SELECT tel from answer_sheet a, subscriber s WHERE " +
        "s.id = subscriber_id AND `date` < CONCAT(date(now()), ' 00:00:00' AND un_reg IS NULL AND service_id = " + req.query.service_id;
    req.getConnection(function (err, connection) {
        if (err) {
            console.log(new Error("Error in Connection"));
            callback({});
            return;
        }
        connection.query(query, function (err, results) {
            if (err) {
                console.log(new Error("Error in Query : " + query));
                return;
            }
            callback(results);
        });
    });
}

function answer(req) {
    var additional;
    if (req.query.isCorrect === 'true') {
        additional = "correct = correct + 1 ";
    } else {
        additional = "wrong = wrong + 1 ";
    }
    var query = "UPDATE answer_sheet " +
        "SET answer_count = answer_count + 1, " + additional +
        "WHERE subscriber_id = " + req.query.subscriber_id;
    req.getConnection(function (err, connection) {
        if (err) {
            console.log(new Error("Error in Connection"));
            callback({});
            return;
        }
        connection.query(query, function (err, results) {
            if (typeof results === "undefined" || err) {
                console.log(new Error("Error in Query : " + query));
            }
        });
    });
}

function getQuestionCount(req, callback) {
    var service = req.query.head_service_id === null ? req.query.service_id : req.query.head_service_id;
    var query = "select count(*) as count from service_prop where service_id = " + service
        + " and `key` like 'question-%'";
    req.getConnection(function (err, connection) {
        if (err) {
            console.log(new Error("Error in Connection"));
            callback({});
            return;
        }
        connection.query(query, function (err, results) {
            if (typeof results === "undefined" || results.length > 1 || err) {
                console.log(new Error("Error in Query : " + query));
            }
            callback(results);
        });
    });
}

function getSignalExport(req, callback) {
    //var service = req.query.head_service_id === null ? req.query.service_id : req.query.head_service_id;
    var query = "SELECT s.tel, a.answer_count, a.correct, a.wrong," +
        "DATE_FORMAT(s.reg,'%Y-%m-%d') reg_date, DATE_FORMAT(s.reg,'%H:%i:%S') reg_time," +
        "DATE_FORMAT(s.un_reg, '%Y-%m-%d') un_reg_date, DATE_FORMAT(s.un_reg, '%H:%i:%S') un_reg_time " +
        "from answer_sheet a, subscriber s, service srv " +
        "WHERE a.subscriber_id = s.id and srv.id = s.service_id and srv.`name` = ?";
    req.getConnection(function (err, connection) {
        if (err) {
            console.log(new Error("Error in Connection"));
            callback({});
            return;
        }
        connection.query(query, [req.body.service], function (err, results) {
            if (typeof results === "undefined" || err) {
                console.log(new Error("Error in Query : " + query));
            }
            callback(results);
        });
    });
}

function getWhyQuestions(req, callback) {
    var query = "SELECT * FROM " +
        "(SELECT sp.`value` question, SUBSTRING(sp.`key`, 1,10) `date` from service_prop sp, service s " +
        "WHERE s.id = sp.service_id " +
        "AND s.`name` = 'Why Interactive' AND sp.`key` LIKE '% question') q, " +
        "(SELECT sp.`value` answer from service_prop sp, service s " +
        "WHERE s.id = sp.service_id  " +
        "AND s.`name` = 'Why Interactive' AND sp.`key` LIKE '% answer') a GROUP BY `date` ORDER BY `date` desc";
    req.getConnection(function (err, connection) {
        if (err) {
            console.log(new Error("Error in Connection"));
            callback({});
            return;
        }
        connection.query(query, function (err, results) {
            if (err) {
                console.log(new Error("Error in Query : " + query));
                callback({});
                return;
            }
            callback(results);
        });
    });
}

function setWhyQuestions(req, callback) {
    req.query.service_name = 'Why Interactive';
    var query;
    require('./service').getService(req, function (srv) {
        query = "INSERT INTO service_prop (service_id, `key`, `value`) " +
            "VALUES (" + req.query.service_id + ", '" + req.body.date + " question', '" + req.body.question + "')";
        //console.log(req.query.service_id)
        req.getConnection(function (err, connection) {
            if (err) {
                console.log(new Error("Error in Connection"));
                callback({});
                return;
            }
            //console.log(query)
            connection.query(query, function (err, results) {
                if (err) {
                    console.log(new Error("Error in Query : " + query));
                    callback({});
                    return;
                }
                query = "INSERT INTO service_prop (service_id, `key`, `value`) " +
                    "VALUES (" + req.query.service_id + ", '" + req.body.date + " answer', '" + req.body.answer + "')";
                connection.query(query, function (err, res) {
                    if (err) {
                        console.log(new Error("Error in Query : " + query));
                        callback({});
                        return;
                    }
                    callback(res);
                });
            });
        });
    });
}

function deleteWhyQuestions(req, callback) {
    //var service = req.query.head_service_id === null ? req.query.service_id : req.query.head_service_id;
    var query = "DELETE FROM service_prop " +
        "WHERE `key` like '" + req.body.id + " %' AND service_id = (SELECT id FROM service WHERE status = 'true' AND `name` = 'Why Interactive')";
    req.getConnection(function (err, connection) {
        if (err) {
            console.log(new Error("Error in Connection"));
            callback({});
            return;
        }
        connection.query(query, function (err, results) {
            if (typeof results === "undefined" || err) {
                console.log(new Error("Error in Query : " + query));
            }
            callback(results);
        });
    });
}

function getStats(req, callback) {
    var query = "SELECT 'sub' txt, COUNT(*) cnt FROM subscriber s, service sr WHERE s.service_id = sr.id AND sr.id = ? AND DATE(s.reg) = ? " +
        "UNION ALL " +
        "SELECT 'un-sub' txt, COUNT(*) cnt FROM subscriber s, service sr WHERE s.service_id = sr.id AND sr.id = ? AND DATE(s.un_reg) = ? " +
        "UNION ALL " +
        "SELECT 'total-sub' txt, COUNT(*) cnt FROM subscriber s, service sr WHERE s.service_id = sr.id AND sr.id = ? AND s.un_reg is null " +
        "UNION ALL " +
        "SELECT 'total-unsub' txt, COUNT(*) cnt FROM subscriber s, service sr WHERE s.service_id = sr.id AND sr.id = ? AND s.un_reg is not null";
    req.getConnection(function (err, connection) {
        connection.query(query, [req.body.service, req.body.date, req.body.service, req.body.date, req.body.service, req.body.service], function (err, results) {
            if (typeof results === "undefined" || err) {
                console.log(new Error("Error in Query : " + query));
            }
            callback(results);
        });
    });
}