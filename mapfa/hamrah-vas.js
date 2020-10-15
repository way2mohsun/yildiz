exports.sendSMS = sendSMS;
var log4js = require('log4js');
var loggerinfo = log4js.getLogger('info');
/*
log4js.configure({
    appenders: [
        {
            type: "dateFile",
            filename: ("/tmp/mt.log"),
            category: 'info',
            pattern: "-yyyy-MM-dd"
        }
    ]

});*/

function sendSMS(phone, scode, text, serviceId, msgType, chargeCode, callback) {

    scode = scode.toString().substr(2, scode.length);
    if (phone.constructor === Array) {
        for (i = 0; i < phone.length; i++) {
            phone[i] = '0' + phone[i].toString().substr(2, phone[i].length);
        }
    } else {
        phone = '0' + phone.toString().substr(2, phone.length);
    }

    var i = 0;
    var http = require('http');
    var parse = require('xml-parser');
    var ip = '10.20.13.12';
    var port = 80;
    var username = 'mateh';
    var password = 'mateh@Hamrah.mci';

    var body = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">' +
            '<soapenv:Header/>' +
            '<soapenv:Body>' +
            '<tem:MessageListUploadWithServiceId>' +
            '<tem:username>' + username + '</tem:username>' +
            '<tem:password>' + password + '</tem:password>' +
            '<tem:numberList>';

    if (phone.constructor === Array) {
        for (i = 0; i < phone.length; i++) {
            body += '<tem:string>' + phone[i] + '</tem:string>';
        }
    } else {
        body += '<tem:string>' + phone + '</tem:string>';
    }

    body += '</tem:numberList><tem:contentList>';

    if (phone.constructor === Array && text.constructor === Array) {
        for (i = 0; i < text.length; i++) {
            body += '<tem:string>' + text[i] + '</tem:string>';
        }
    } else if (phone.constructor === Array) {
        for (i = 0; i < phone.length; i++) {
            body += '<tem:string>' + text + '</tem:string>';
        }
    } else {
        body += '<tem:string>' + text + '</tem:string>';
    }

    body += '</tem:contentList><tem:origShortCodeList>';

    if (phone.constructor === Array) {
        for (i = 0; i < phone.length; i++) {
            body += '<tem:string>' + scode + '</tem:string>';
        }
    } else {
        body += '<tem:string>' + scode + '</tem:string>';
    }

    body += '</tem:origShortCodeList><tem:serviceIdList>';

    if (phone.constructor === Array) {
        for (i = 0; i < phone.length; i++) {
            body += '<tem:int>' + serviceId + '</tem:int>';
        }
    } else {
        body += '<tem:int>' + serviceId + '</tem:int>';
    }

    body += '</tem:serviceIdList><tem:MsgTypeCodeList>';

    if (phone.constructor === Array) {
        for (i = 0; i < phone.length; i++) {
            body += '<tem:int>' + msgType + '</tem:int>';
        }
    } else {
        body += '<tem:int>' + msgType + '</tem:int>';
    }

    body += '</tem:MsgTypeCodeList><tem:chargeCodeNumberList>';

    if (phone.constructor === Array) {
        for (i = 0; i < phone.length; i++) {
            body += '<tem:int>' + chargeCode + '</tem:int>';
        }
    } else {
        body += '<tem:int>' + chargeCode + '</tem:int>';
    }

    body += '</tem:chargeCodeNumberList>' +
            '</tem:MessageListUploadWithServiceId>' +
            '</soapenv:Body>' +
            '</soapenv:Envelope>';
    var postRequest = {
        host: ip,
        path: '/SMSBuffer.asmx?WSDL',
        port: port,
        method: 'POST',
        headers: {'Content-Type': 'text/xml;charset=UTF-8',
            'SOAPAction': 'http://tempuri.org/MessageListUploadWithServiceId'}
    };
    var req = http.request(postRequest, function (res) {
        var chunks = [];
        res.on('data', function (data) {
            chunks.push(data);
        });
        res.on('end', function () {
            try {
                var obj = parse(Buffer.concat(chunks).toString());
                obj = obj.root.children[0].children[0].children[0].children;
                var out = [];
                var o;
                for (i = 0; i < obj.length; i++) {
                    o = '';
                    if (phone.constructor === Array) {
                        o = phone[i] + ':';
                    } else {
                        o = phone + ':';
                    }
                    o += scode + ':' + serviceId + ':' + chargeCode + ':' + obj[i].content + ':';
                    if (text.constructor === Array) {
                        o += text[i].replace(/(\r\n|\n|\r)/gm, "");
                    } else {
                        o += text.replace(/(\r\n|\n|\r)/gm, "");
                    }
                    loggerinfo.info(o);
                    out[i] = obj[i].content;
                }
                callback(phone + ':' + out);
            } catch (e) {
                callback('Error : ' + e);
            }
        });
    });
    req.on('error', function (err) {
        console.log(err);
    });
    req.write(body);
    req.end();
}