$(document).ready(function () {
    var menu;
    $.ajax({
        async: false, type: 'POST', url: "/home", timeout: 5000,
        data: {
            functionality: 'getMenu'
        },
        success: function (data) {
            menu = data;
        }
    });
    var list;
    menu.forEach(function (value, key) {
        list = '<ul class="nav navbar-nav">' +
                '<li class="dropdown">' +
                '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true">' + value.name + '<span class="caret"></span></a>' +
                '<ul class="dropdown-menu">' +
                '<li>';
        value.detail.forEach(function (v, k) {
            list += '<a id="' + v.id + '" href="#" rel="' + v.path + '">' + v.name + '</a>';
        });
        list += '</li><ul></li></ul>';
        $('#root').append(list);
    });
});

$(document).on('click', '.dropdown-menu li a', function (e) {
    //$(this).index()
    $('#body').empty();
    if ($(this).attr('rel')) {
        $.ajax({
            async: false, type: 'GET', url: $(this).attr('rel'), timeout: 5000,
            success: function (data) {
                $('#body').append(data);
            },
            error: function (xhr, textStatus, err) {
                window.location = "/";
            }
        });
    }
});