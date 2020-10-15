//console.log(j2g('1361/12/01'));
//console.log(g2j('1983-02-20'));
exports.j2g = j2g;
exports.g2j = g2j;
exports.g2j4IntegratedPanel = g2j4IntegratedPanel;
exports.jToday = jToday;
exports.gToday = gToday;
exports.toFaDigit = toFaDigit;
exports.nameOfTheWeekday = nameOfTheWeekday;

Date.jalaliConverter = {};

Date.jalaliConverter.gregorianDaysInMonth = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
Date.jalaliConverter.jalaliDaysInMonth = new Array(31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29);

Date.jalaliConverter.div = function (a, b) {
    return Math.floor(a / b);
};

Date.jalaliConverter.remainder = function (a, b) {
    return a - Math.floor(a / b) * b;
};

/**
 * Converts a Gregorian date to Jalali.
 * @param {Array} g An array containing Gregorian year, month and date.
 * @return {Array} An array containing Jalali year, month and date.
 */
function gregorianToJalali(g) {
    var gy, gm, gd;
    var jy, jm, jd;
    var g_day_no, j_day_no;
    var j_np;

    var i;

    gy = g[0] - 1600;
    gm = g[1] - 1;
    gd = g[2] - 1;

    var div = Date.jalaliConverter.div;
    var remainder = Date.jalaliConverter.remainder;
    var g_days_in_month = Date.jalaliConverter.gregorianDaysInMonth;
    var j_days_in_month = Date.jalaliConverter.jalaliDaysInMonth;

    g_day_no = 365 * gy + div((gy + 3), 4) - div((gy + 99), 100) + div((gy + 399), 400);
    for (i = 0; i < gm; ++i)
        g_day_no += g_days_in_month[i];
    if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)))
        /* leap and after Feb */
        ++g_day_no;
    g_day_no += gd;

    j_day_no = g_day_no - 79;

    j_np = div(j_day_no, 12053);
    j_day_no = remainder(j_day_no, 12053);

    jy = 979 + 33 * j_np + 4 * div(j_day_no, 1461);
    j_day_no = remainder(j_day_no, 1461);

    if (j_day_no >= 366) {
        jy += div((j_day_no - 1), 365);
        j_day_no = remainder((j_day_no - 1), 365);
    }

    for (i = 0; i < 11 && j_day_no >= j_days_in_month[i]; ++i) {
        j_day_no -= j_days_in_month[i];
    }
    jm = i + 1;
    jd = j_day_no + 1;

    return new Array(jy, jm, jd);
}
;

/**
 * Converts a Jalali date to Gregorian.
 * @param {Array} j An array containing Jalali year, month and date.
 * @return {Array} An array containing Gregorian year, month and date.
 */
function jalaliToGregorian(j) {
    var gy, gm, gd;
    var jy, jm, jd;
    var g_day_no, j_day_no;
    var leap;

    var i;

    jy = j[0] - 979;
    jm = j[1] - 1;
    jd = j[2] - 1;

    var div = Date.jalaliConverter.div;
    var remainder = Date.jalaliConverter.remainder;
    var g_days_in_month = Date.jalaliConverter.gregorianDaysInMonth;
    var j_days_in_month = Date.jalaliConverter.jalaliDaysInMonth;

    j_day_no = 365 * jy + div(jy, 33) * 8 + div((remainder(jy, 33) + 3), 4);
    for (i = 0; i < jm; ++i)
        j_day_no += j_days_in_month[i];

    j_day_no += jd;

    g_day_no = j_day_no + 79;

    gy = 1600 + 400 * div(g_day_no, 146097);
    /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
    g_day_no = remainder(g_day_no, 146097);

    leap = 1;
    if (g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */
    {
        g_day_no--;
        gy += 100 * div(g_day_no, 36524);
        /* 36524 = 365*100 + 100/4 - 100/100 */
        g_day_no = remainder(g_day_no, 36524);

        if (g_day_no >= 365)
            g_day_no++;
        else
            leap = 0;
    }

    gy += 4 * div(g_day_no, 1461);
    /* 1461 = 365*4 + 4/4 */
    g_day_no = remainder(g_day_no, 1461);

    if (g_day_no >= 366) {
        leap = 0;

        g_day_no--;
        gy += div(g_day_no, 365);
        g_day_no = remainder(g_day_no, 365);
    }

    for (i = 0; g_day_no >= g_days_in_month[i] + (i === 1 && leap); i++)
        g_day_no -= g_days_in_month[i] + (i === 1 && leap);
    gm = i + 1;
    gd = g_day_no + 1;

    return new Array(gy, gm, gd);
}

function j2g(date) {
    try {
        var d = date.toString().split('/');
        d = jalaliToGregorian([d[0], d[1], d[2]]);
        return d[0] + '-' + (d[1] < 10 ? '0' + d[1] : d[1]) + '-' + (d[2] < 10 ? '0' + d[2] : d[2]);
    } catch (e) {
        return "";
    }
}

function g2j(date) {
    try {
        var d = date.toString().split('-');
        d = gregorianToJalali([d[0], d[1], d[2]]);
        return d[0] + '/' + (d[1] < 10 ? '0' + d[1] : d[1]) + '/' + (d[2] < 10 ? '0' + d[2] : d[2]);
    } catch (e) {
        return "";
    }
}

function g2j4IntegratedPanel(date) {
    try {
        var d = date.toString().split('-');
        d = gregorianToJalali([d[0], d[1], d[2]]);
        return d[0] + '-' + (d[1] < 10 ? '0' + d[1] : d[1]) + '-' + (d[2] < 10 ? '0' + d[2] : d[2]);
    } catch (e) {
        return "";
    }
}
function jToday() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var sec = date.getSeconds();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return g2j(date.getFullYear() + '-' + (date.getMonth() + 1) + "-" + date.getDate()) + " " + hours + ':' + minutes + ':' + sec;
}

function gToday() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var sec = date.getSeconds();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return date.getFullYear() + '-' + (date.getMonth() + 1) + "-" + date.getDate() + " " + hours + ':' + minutes + ':' + sec;
}

function toFaDigit(data) {
    return data.toString().replace(/\d+/g, function (digit) {
        var ret = '';
        for (var i = 0, len = digit.length; i < len; i++) {
            ret += String.fromCharCode(digit.charCodeAt(i) + 1728);
        }
        return ret;
    });
}

//http://jsfiddle.net/TMsXM/3/
exports.getBetweenDates = function (from, to) {

    from = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    to = new Date(to.getFullYear(), to.getMonth(), to.getDate());

    var between = [], y, m, d;

    while (from <= to) {
        y = from.getFullYear();
        m = from.getMonth() + 1;
        d = from.getDate();
        m = m < 10 ? '0' + m : m;
        d = d < 10 ? '0' + d : d;
        between.push(y + '-' + m + '-' + d);
        from.setDate(from.getDate() + 1);
    }
    return between;
};

function nameOfTheWeekday() {
    var d = new Date();
    var weekday = new Array(7);
    
    weekday[0] = 'Sunday';
    weekday[1] = 'Monday';
    weekday[2] = 'Tuesday';
    weekday[3] = 'Wednesday';
    weekday[4] = 'Thursday';
    weekday[5] = 'Friday';
    weekday[6] = 'Saturday';

    return weekday[d.getDay()];
}