exports.toFaDigit = toFaDigit;
exports.toEnDigit = toEnDigit;

function toFaDigit(input) {
    try {
        return input.toString().replace(/\d+/g, function (digit) {
            var ret = '';
            for (var i = 0, len = digit.length; i < len; i++) {
                ret += String.fromCharCode(digit.charCodeAt(i) + 1728);
            }
            return ret;
        });
    } catch (e) {
        return "";
    }
}

function toEnDigit(input) {
    try {
        return input.toString().replace(/[\u06F0-\u06F9]+/g, function (digit) {
            var ret = '';
            for (var i = 0, len = digit.length; i < len; i++) {
                ret += String.fromCharCode(digit.charCodeAt(i) - 1728);
            }
            return ret;
        });
    } catch (e) {
        return "";
    }
}