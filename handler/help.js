var hamrahvas = require('../mapfa/hamrah-vas');

exports.processRequest = function (req) {

    var query = "SELECT s.service_id, `value` from service s, service_prop sp \
        WHERE sp.service_id = s.id and status = 'true' and sp.`key` = 'help' and head is null and receive_scode = ?";

    req.getConnection(function (err, connection) {
        if (err)
            return console.log(err);
        res = connection.query(query, [req.query.scode]);
        res.on('error', function (err) {
            return console.log(err);
        });
        var results = [];
        res.on('result', function (result) {
            results.push(result);
        });
        res.on('end', function () {
            if (results.length < 1) 
                return console.log('Help results is empty!');
            var txt = "مشترک گرامی برای فعالسازی هر یک از سرویس ها کلیدواژه مربوطه را به SCODE ارسال نمایید. هزينه سرويس ۱۰۰ تومان به ازاي هر پیامک ميباشد. و جهت غیر فعال سازی سرویس های فعال خود off یا خاموش را به SCODE ارسال نمایید.";
            txt += '\n';
            for (var i in results) {
                txt += results[i].value + '\n';
            }
            txt = txt.replace(/SCODE/g, Math.floor(req.query.scode % (Math.pow(10, req.query.scode.length - 2))));
            hamrahvas.sendSMS(req.query.tel, req.query.scode, txt, results[0].service_id, 0, '00', function (callback) {});
        });
    });
};