$(document).ready(function () {
    var out;
    $("form").submit(function () {
        $('#msg').empty();
        $.ajax({
            async: false, type: 'POST', url: "/", timeout: 5000,
            data: {
                user: $('#user').val(),
                password: $('#password').val()
            }, success: function (data) {
                out = data;
            }, error: function (data) {
                out = true;
            }
        });
        if (!out) {
            alert('Username or Password is not correct!!!');
            return false;
        }
    });
});