exports.timeFormat = function (input) {
    var timeFormat = /^[0-2]?[0-9]\:[0-9]?[0-9]$/;
    //var input = '20:60';
    var res = timeFormat.exec(input);
    if (res === null) {
        return false;
    } else {
        res = input.split(':');
        if (res[0] > 23 || res[1] > 59) {
            return false;
        }
    }
    return true;
};

exports.dateFormat = function (input) {
    var timeFormat = /^139[3-9]\/[0-1]?[0-9]\/[0-3]?[0-9]$/;
    var res = timeFormat.exec(input);
    if (res === null) {
        return false;
    } else {
        res = input.split('/');
        if (res[1] > 12 || res[2] > 31 || res[1] === '00' || res[1] === '00') {
            return false;
        }
    }
    return true;
};

exports.validateEmail = function (email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
};