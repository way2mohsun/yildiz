var hamrahvas = require('../../mapfa/hamrah-vas');
var jalali = require('../../util/jalali');
var HashMap = require('hashmap').HashMap;
var cron = require('cron').CronJob;
var mysql = require('mysql');

exports.notificationStartupTime = function (connProp) {

    new cron('0 */1 * * * *', function () {

        var d = new Date();
        var conn = mysql.createConnection(connProp);
        var query = "SELECT `value`, s.id, scode, s.service_id, s.comment FROM service_prop p, service s \
                WHERE s.id = p.service_id AND status = 'true' AND `key` = 'notification startup time'";
        conn.query(query)
                .on('error', function (err) {
                    conn.end();
                    return console.log(err);
                })
                .on('result', function (result) {
                    var s = result.value;
                    s = s.split(':');

                    if (s.length !== 2)
                        return console.log('Length of startup date is invalid : ' + s.length);

                    var h = s[0];
                    var m = s[1];

                    if (isNaN(h) || isNaN(m))
                        return console.log('Value of startup date is invalid.');

                    h = Number(h);
                    m = Number(m);

                    if (h > 20 || h < 9)
                        return console.log('Range of date is not valid');

                    var th = d.getHours();
                    var tm = d.getMinutes();
                    th = Number(th);
                    tm = Number(tm);

                    if (th !== h || tm !== m)
                        return;//console.log('The is not reached');

                    fetchContents(connProp, result.id, result.service_id, result.scode, result.comment);

                }).
                on('end', function () {
                    conn.end();
                });
    }, function () {
        // This function is executed when the job stops
    }, true);
};

function fetchContents(connProp, service, service_id, scode, serviceName) {

    var contents = new HashMap();
    var which = new RegExp(/\d+/);
    var match;
    var conn = mysql.createConnection(connProp);
    var query = "SELECT * FROM service_prop WHERE service_id = ? AND `key` LIKE 'content-%'";

    conn.query(query, [service])
            .on('error', function (err) {
                conn.end();
                return console.log(err);
            })
            .on('result', function (result) {
                try {
                    match = which.exec(result.key);
                    if (match === null)
                        return;
                    match = Number(match[0]);
                    contents.set(match, result.value);
                } catch (err) {
                    console.log(err);
                }
            })
            .on('end', function () {
                conn.end();
                fetchSubscribers(connProp, service, service_id, scode, contents, serviceName);
            });
}



function fetchSubscribers(connProp, service, service_id, scode, contents, serviceName) {
    var support = '';

    if (typeof serviceName === 'undefined')
        serviceName = '';

    if (jalali.nameOfTheWeekday() === 'Saturday' || jalali.nameOfTheWeekday() === 'Monday' || jalali.nameOfTheWeekday() === 'Wednesday')
        support = '\n' + 'شماره پشتیبانی:۲۲۶۳۹۶۷۱(۰۲۱)';

    var conn = mysql.createConnection(connProp);
    var tel = [];
    var text = [];
    var which = 0;

    var query = "SELECT * FROM subscriber WHERE service_id = ? AND un_reg IS NULL AND date(reg) != date(now())";

    conn.query(query, [service])
            .on('error', function (err) {
                conn.end();
                return console.log(err);
            })
            .on('result', function (result) {

                which = jalali.getBetweenDates(result.reg, new Date()).length;

                if (contents.has(which)) {
                    tel.push(result.tel);
                    text.push(contents.get(which) + support);
                }
                if (tel.length === 90) {
                    hamrahvas.sendSMS(tel, scode, text, service_id, 0, '01', function (c) {});
                    tel = [];
                    text = [];
                }
            })
            .on('end', function () {
                conn.end();
                if (tel.length !== 0)
                    hamrahvas.sendSMS(tel, scode, text, service_id, 0, '01', function (c) {});
            });

}