/* global g2j */

var selected;

function fillSchedulerTable() {
    $("#service-table tbody").remove();
    $('#service-table').append('<tbody></tbody>');
    $.ajax({
        async: false,
        type: 'POST',
        url: "/scheduler-bulk",
        timeout: 5000,
        data: {
            functionality: 'getAll'
        },
        success: function (data) {
            //console.log(JSON.stringify(data));
            $.each(data, function (index, row) {
                if (row.message.length > 50) {
                    row.message = row.message.substring(0, 50) + ' ...';
                }
                $('#service-table').append(
                        '<tr id="' + row.id + '"><td><span>' + g2j(row.startup.substring(0, 10)).toFaDigit() + ' ' + row.startup.substring(11, 16).toFaDigit() + '</span></td>' +
                        '<td><label><span >' + row.message + '</span></label></td>' +
                        '<td><label><span >' + row.short_code + '</span></label></td>' +
                        '<td><label><span >' + row.service_key + '</span></label></td>' +
                        '<td><p data-placement="top" data-toggle="tooltip" title="Edit"><button id="edit-' + row.id + '" class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal" data-target="#modal-edit" ><span class="glyphicon glyphicon-pencil"></span></button></p></td>' +
                        '<td><p data-placement="top" data-toggle="tooltip" title="Delete"><button id="delete' + row.id + '" class="btn btn-danger btn-xs" data-title="Delete" data-toggle="modal" data-target="#modal-delete" ><span class="glyphicon glyphicon-trash"></span></button></p></td><tr>');
            });
        },
        error: function (xhr, textStatus, err) {
            window.location = "/";
        }
    });
}

function clear() {
    $('#error').remove();
    $('#success').remove();
    $('#upload').val('');
}

function RegisterValidation() {
    var isValid4Register = false;
    if (timeFormat($('#startup-time').val())) {
        $('#startup-time').removeClass('error');
        isValid4Register = true;
    } else {
        $('#startup-time').addClass('error');
        isValid4Register = false;
    }
    if (dateFormat($('#startup-date').val())) {
        $('#startup-date').removeClass('error');
        isValid4Register = true;
    } else {
        $('#startup-date').addClass('error');
        isValid4Register = true;
    }
    if ($('#short-code').val().length < 1) {
        $('#short-code').addClass('error');
        isValid4Register = false;
    } else {
        $('#short-code').removeClass('error');
        isValid4Register = true;
    }
    if ($('#service-key').val().length < 1) {
        $('#service-key').addClass('error');
        isValid4Register = false;
    } else {
        $('#service-key').removeClass('error');
        isValid4Register = true;
    }
    if ($('#message').val().length < 2) {
        $('#message').addClass('error');
        isValid4Register = false;
    } else {
        $('#message').removeClass('error');
        isValid4Register = true;
    }
    if ($('#username').val().length < 2) {
        $('#username').addClass('error');
        isValid4Register = false;
    } else {
        $('#username').removeClass('error');
        isValid4Register = true;
    }
    if ($('#password').val().length < 2) {
        $('#password').addClass('error');
        isValid4Register = false;
    } else {
        $('#password').removeClass('error');
        isValid4Register = true;
    }
    if ($('#domain').val().length < 2) {
        $('#domain').addClass('error');
        isValid4Register = false;
    } else {
        $('#domain').removeClass('error');
        isValid4Register = true;
    }
    if ($('#upload').val() === '') {
        $('#upload').addClass('error');
        isValid4Register = false;
    } else {
        $('#upload').removeClass('error');
        isValid4Register = true;
    }
    return isValid4Register;
}

function EditValidation() {
    var isValid4Edit = false;
    if (timeFormat($('#edit-startup-time').val())) {
        $('#edit-startup-time').removeClass('error');
        isValid4Edit = true;
    } else {
        $('#edit-startup-time').addClass('error');
        isValid4Edit = false;
    }
    if (dateFormat($('#edit-startup-date').val())) {
        $('#edit-startup-date').removeClass('error');
        isValid4Edit = true;
    } else {
        $('#edit-startup-date').addClass('error');
        isValid4Edit = true;
    }
    if ($('#edit-short-code').val().length < 1) {
        $('#edit-short-code').addClass('error');
        isValid4Edit = false;
    } else {
        $('#edit-short-code').removeClass('error');
        isValid4Edit = true;
    }
    if ($('#edit-service-key').val().length < 1) {
        $('#edit-service-key').addClass('error');
        isValid4Edit = false;
    } else {
        $('#edit-service-key').removeClass('error');
        isValid4Edit = true;
    }
    if ($('#edit-message').val().length < 2) {
        $('#edit-message').addClass('error');
        isValid4Edit = false;
    } else {
        $('#edit-message').removeClass('error');
        isValid4Edit = true;
    }
    if ($('#edit-username').val().length < 2) {
        $('#edit-username').addClass('error');
        isValid4Register = false;
    } else {
        $('#edit-username').removeClass('error');
        isValid4Register = true;
    }
    if ($('#edit-password').val().length < 2) {
        $('#edit-password').addClass('error');
        isValid4Register = false;
    } else {
        $('#edit-password').removeClass('error');
        isValid4Register = true;
    }
    if ($('#edit-domain').val().length < 2) {
        $('#edit-domain').addClass('error');
        isValid4Register = false;
    } else {
        $('#edit-domain').removeClass('error');
        isValid4Register = true;
    }
    return isValid4Edit;
}

$(document).ready(function () {
    fillSchedulerTable();
    $('#refresh-message').hide();
    $("#refresh").click(function () {
        $('#refresh-message').show();
        $("#refresh-message").delay(1000).fadeOut("slow");
        fillSchedulerTable();
    });
    $('#squarespaceModal').on('hidden.bs.modal', function () {
        clear();
    });
    $('table').on('click', '.btn-danger', function () {
        selected = this.id;
    });
    $('table').on('click', '.btn-primary', function () {
        selected = this.id.split('-')[1];
        $.ajax({
            async: false,
            type: 'POST',
            url: "/scheduler-bulk",
            timeout: 5000,
            data: {
                functionality: 'get',
                id: selected
            },
            success: function (data) {
                data = data[0];
                $('#edit-startup-date').val(g2j(data.startup.split('T')[0]));
                $('#edit-startup-time').val(data.startup.split('T')[1].substring(0, 5));
                $('#edit-short-code').val(data.short_code);
                $('#edit-service-key').val(data.service_key);
                $('#edit-username').val(data.username);
                $('#edit-password').val(data.password);
                $('#edit-domain').val(data.domain);
                $('#edit-message').val(data.message);
            },
            error: function (xhr, textStatus, err) {
                window.location = "/";
            }
        });
    });

    $("#close").click(function () {
        clear();
    });
    $("#startup-date").datepicker({
        //showOtherMonths: true,
        //selectOtherMonths: true,
        //changeMonth: true,
        //changeYear: true,
        minDate: 0,
        maxDate: "+2M",
        dateFormat: "yy/mm/dd"
    });
    $("#startup-date").click(function (event) {
        event.preventDefault();
        $("#startup-date").focus();
    });
    $("#startup-time").blur(function () {
        if (timeFormat($('#startup-time').val())) {
            $('#startup-time').removeClass('error');
        } else {
            $('#startup-time').addClass('error');
        }
        if (dateFormat($('#startup-date').val())) {
            $('#startup-date').removeClass('error');
        } else {
            $('#startup-date').addClass('error');
        }
    });
    $("#startup-date").blur(function () {
        //RegisterValidation();
    });
    $("#short-code").blur(function () {
        if ($('#short-code').val().length < 1) {
            $('#short-code').addClass('error');
        } else {
            $('#short-code').removeClass('error');
        }
    });
    $("#service-key").blur(function () {
        if ($('#service-key').val().length < 1) {
            $('#service-key').addClass('error');
        } else {
            $('#service-key').removeClass('error');
        }
    });
    $("#message").blur(function () {
        if ($('#message').val().length < 2) {
            $('#message').addClass('error');
        } else {
            $('#message').removeClass('error');
        }
    });
    $("#username").blur(function () {
        if ($('#username').val().length < 2) {
            $('#username').addClass('error');
        } else {
            $('#username').removeClass('error');
        }
    });
    $("#password").blur(function () {
        if ($('#password').val().length < 2) {
            $('#password').addClass('error');
        } else {
            $('#password').removeClass('error');
        }
    });
    $("#domain").blur(function () {
        if ($('#domain').val().length < 2) {
            $('#domain').addClass('error');
        } else {
            $('#domain').removeClass('error');
        }
    });
    $("#save").click(function () {
        if (!RegisterValidation()) {
            $('#create-job').append('<div id="error" class="alert alert-danger" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                    '<span aria-hidden="true">&times;</span></button>' +
                    '<strong>Oh snap!</strong> Please fill the mentioned field !' +
                    '</div>');
            return false;
        }
        var file_data = $("#upload").prop("files")[0];
        var form_data = new FormData();
        form_data.append("file", file_data);
        form_data.append("startup-date", $('#startup-date').val());
        form_data.append("startup-time", $('#startup-time').val());
        form_data.append("short-code", $('#short-code').val());
        form_data.append("service-key", $('#service-key').val());
        form_data.append("message", $('#message').val());
        form_data.append("username", $('#username').val());
        form_data.append("password", $('#password').val());
        form_data.append("domain", $('#domain').val());
        $.ajax({
            url: "/scheduler-bulk",
            dataType: 'script',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function (data) {
                clear();
                var msg = '<div class="alert alert-success" role="alert" id="success">' +
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                        '<span aria-hidden="true">&times;</span></button>' +
                        '<strong>Success!</strong> ' + data +
                        '</div>';
                $('#create-job').append(msg);
                //$("#success").delay(3000).fadeOut("slow");
                fillSchedulerTable();
            },
            error: function (err) {
                //this message variable eval("(" + err.responseText + ")").message
                //console.log(JSON.stringify(err));
                $('#error').remove();
                $('#success').remove();
                var msg = '<div id="error" class="alert alert-danger" role="alert">' +
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                        '<span aria-hidden="true">&times;</span></button>' +
                        '<strong>Oh snap!</strong> ' + err.responseText +
                        '</div>';
                $('#create-job').append(msg);
            }
        });
    });
    $("#edit-startup-date").datepicker({
        //showOtherMonths: true,
        //selectOtherMonths: true,
        //changeMonth: true,
        //changeYear: true,
        //minDate: 0,
        maxDate: "+1M",
        dateFormat: "yy/mm/dd"
    });
    $("#edit-startup-date").click(function (event) {
        event.preventDefault();
        $("#edit-startup-date").focus();
    });
    $("#edit-startup-time").blur(function () {
        if (timeFormat($('#edit-startup-time').val())) {
            $('#edit-startup-time').removeClass('error');
        } else {
            $('#edit-startup-time').addClass('error');
        }
        if (dateFormat($('#edit-startup-date').val())) {
            $('#edit-startup-date').removeClass('error');
        } else {
            $('#edit-startup-date').addClass('error');
        }
    });
    $("#edit-startup-date").blur(function () {
        //RegisterValidation();
    });
    $("#edit-short-code").blur(function () {
        if ($('#edit-short-code').val().length < 1) {
            $('#edit-short-code').addClass('error');
        } else {
            $('#edit-short-code').removeClass('error');
        }
    });
    $("#edit-service-key").blur(function () {
        if ($('#edit-service-key').val().length < 1) {
            $('#edit-service-key').addClass('error');
        } else {
            $('#edit-service-key').removeClass('error');
        }
    });
    $("#edit-message").blur(function () {
        if ($('#edit-message').val().length < 2) {
            $('#edit-message').addClass('error');
        } else {
            $('#edit-message').removeClass('error');
        }
    });
    $('#edit-confirmation').click(function () {
        if (!EditValidation()) {
            $('#edit-job').append('<div id="error" class="alert alert-danger" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                    '<span aria-hidden="true">&times;</span></button>' +
                    '<strong>Oh snap!</strong> Please fill the mentioned field !' +
                    '</div>');
            return false;
        }
        $('#modal-edit').modal('toggle');
        $.ajax({
            async: false,
            type: 'POST',
            url: "/scheduler-bulk",
            timeout: 5000,
            data: {
                functionality: 'edit',
                id: selected,
                startup_date: $('#edit-startup-date').val(),
                startup_time: $('#edit-startup-time').val(),
                short_code: $('#edit-short-code').val(),
                service_key: $('#edit-service-key').val(),
                username: $('#edit-username').val(),
                password: $('#edit-password').val(),
                domain: $('#edit-domain').val(),
                message: $('#edit-message').val()
            },
            success: function (data) {
                fillSchedulerTable();
                selected = '';
            },
            error: function (xhr, textStatus, err) {
                window.location = "/";
            }
        });
    });
    $('#delete-confirmation').click(function () {
        $('#modal-delete').modal('toggle');
        selected = selected.substring(6, selected.length);
        $.ajax({
            async: false,
            type: 'POST',
            url: "/scheduler-bulk",
            timeout: 5000,
            data: {
                functionality: 'delete',
                id: selected
            },
            success: function (data) {
                fillSchedulerTable();
                selected = '';
            },
            error: function (xhr, textStatus, err) {
                selected = '';
                window.location = "/";
            }
        });
    });
});