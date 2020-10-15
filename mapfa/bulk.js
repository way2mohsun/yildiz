exports.send = send;

function send(username, password, domain, shortCode, serviceId, text, file) {

    //console.log('call : ' + username + ','+',' +password + ','+',' +domain + ','+',' +shortCode + ','+',' +serviceId + ','+',' +text + ','+',' +file);
    var fs = require('fs'),
            readline = require('readline');

    var counter = 0;
    var tel = [];

    var path = '/scheduler-file/' + file + '.txt';

    fs.appendFile(path, '\n', function (err) {

        if (err) {
            console.log(err);
            return;
        }

        var rd = readline.createInterface({
            input: fs.createReadStream(path),
            output: process.stdout,
            terminal: false
        });

        rd.on('line', function (line) {
            var out;
            tel[counter] = line;
            counter++;
            if (counter === 90) {
                sendSMS(username, password, domain, shortCode, serviceId, text, tel, function (data) {
                    out = '';
                    for (i = 0; i < data.length; i++) {
                        out += tel[i] + ':' + data[i] + ' ';
                    }
                    console.log(out);
                });
                counter = 0;
                tel = [];
            }
        });

        rd.on('close', function () {
            var out;
            if (counter !== 0) {
                sendSMS(username, password, domain, shortCode, serviceId, text, tel, function (data) {
                    out = '';
                    for (i = 0; i < data.length; i++) {
                        out += tel[i] + ':' + data[i] + ' ';
                    }
                    console.log(out);
                });
            }
        });
    });
}

function sendSMS(username, password, domain, shortCode, serviceId, text, phone, callback) {
    var i = 0;
    var http = require('http');
    var parse = require('xml-parser');
    //var inspect = require('util').inspect;
    var body = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:srv="http://Srv/">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<srv:ServiceSend>' +
            //'<username>kishfreezone</username>' +
            '<username>' + username + '</username>' +
            //'<password>70fc0b97f4fb6d8c5e16f81a4f4351b0</password>' +
            '<password>' + password + '</password>' +
            //'<domain>maat</domain>' +
            '<domain>' + domain + '</domain>' +
            '<msgType>0</msgType>';
    for (i = 0; i < phone.length; i++) {
        body += '<messages>' + text + '</messages>' +
                '<destinations>' + phone[i] + '</destinations>' +
                '<originators>' + shortCode + '</originators>' +
                '<udhs>1</udhs>' +
                '<mClass>0</mClass>' +
                '<ServiceIds>' + serviceId + '</ServiceIds>';
    }
    body += '</srv:ServiceSend>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>';
    //console.log(body);
    var postRequest = {
        host: '172.16.36.148',
        path: "/ws/Send?wsdl",
        port: 9005,
        method: "POST",
        headers: {"Content-Type": "text/xml;charset=UTF-8"}
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
            } catch (err) {
                callback({});
            }
        });
        res.on('error', function (err) {
            console.log(err);
        });
    });
    req.on('error', function (err) {
        console.log('unable to connect : ' + err);
    });
    req.write(body);
    req.end();
}