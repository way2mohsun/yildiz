exports.sendSMS = sendSMS;

function sendSMS(phone, scode, serviceId, text, callback) {
    var i = 0;
    var http = require('http');
    var parse = require('xml-parser');
    var ip = '172.16.36.148';
    var port = 9005;
    var username = 'kishfreezone';
    var password = '70fc0b97f4fb6d8c5e16f81a4f4351b0';
    var domain = 'alladmin';
    var body = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:srv="http://Srv/">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<srv:ServiceSend>' +
            '<username>' + username + '</username>' +
            '<password>' + password + '</password>' +
            '<domain>' + domain + '</domain>' +
            '<msgType>0</msgType>';
    for (i = 0; i < phone.length; i++) {
        if (text.constructor === Array) {
            body += '<messages>' + text[i] + '</messages>';
        } else {
            body += '<messages>' + text + '</messages>';
        }
        body += '<destinations>' + phone[i] + '</destinations>' +
                '<originators>' + scode + '</originators>' +
                '<udhs>1</udhs><mClass>0</mClass>' +
                '<ServiceIds>' + serviceId + '</ServiceIds>';
    }
    body += '</srv:ServiceSend>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>';
    var postRequest = {
        host: ip,
        path: '/ws/Send?wsdl',
        port: port,
        method: 'POST',
        headers: {'Content-Type': 'text/xml;charset=UTF-8'}
    };
    var req = http.request(postRequest, function (res) {
        var chunks = [];
        res.on('data', function (data) {
            chunks.push(data);
        });
        res.on('end', function () {
            try {
                var obj = parse(Buffer.concat(chunks).toString());
                obj = obj.root.children[0].children[0].children;
                var out = [];
                for (i = 0; i < obj.length; i++) {
                    out[i] = obj[i].content;
                }
                callback(out);
            } catch (e) {
                console.log('unable to connect : ' + e);
            }
        });
    });
    req.on('error', function (err) {
        console.log('unable to connect : ' + err);
    });
    req.write(body);
    req.end();
}