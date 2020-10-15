var services = [];
var service_properties = [];
var service_property_selected;
var service_selected;
var service_type_selected;

$(document).on('click', 'button[id^="edit-sp-"]', function (e) {
    service_selected = Number(this.id.replace('edit-sp-', ''));
    var serviceName = '';
    $.each(services, function (index, row) {
        if (row.id === service_selected)
            serviceName = row.comment;
    });
    $('#lineModalLabel').text('Property of ' + serviceName);
    fillServiceProperty(service_selected);
});

$(document).on('click', 'button[id^="delete-sp-btn-"]', function (e) {
    service_property_selected = Number(this.id.replace('delete-sp-btn-', ''));
    console.log(this.id);
    $.when($('#' + this.id).fadeOut(500)).done(function () {
        $('#sp-value-' + service_property_selected).after($('\
            <label  id="sp-confirm-label-' + service_property_selected + '"><span>Do you want to delete?</span></label>\
            <button id="sp-confirm-yes-' + service_property_selected + '" class="btn btn-default">Yes</button>\
            <button id="sp-confirm-no-' + service_property_selected + '" class="btn btn-default">No</button>'));
    });
});

$(document).on('click', 'button[id^="sp-confirm-no-"]', function (e) {
    var confirm = Number(this.id.replace('sp-confirm-no-', ''));
    $('[id^="sp-confirm"]').fadeOut(250);
    $('#sp-value-' + service_property_selected).after($('<button id="delete-sp-btn-' + confirm + '" class="glyphicon glyphicon-remove">'));
});

$(document).on('click', 'button[id^="sp-confirm-yes-"]', function (e) {
    var confirm = Number(this.id.replace('sp-confirm-yes-', ''));
    console.log('id:' + confirm);
    $.ajax({
        async: false, type: 'POST', url: "service", timeout: 10000,
        data: {
            functionality: 'delete prop',
            id: confirm
        },
        success: function (data) {
            $('[id^="sp-confirm"]').fadeOut(250);
            $('#sp-value-' + confirm).fadeOut(250);
            $('#sp-key-' + confirm).fadeOut(250);
            fillServiceProperty(service_selected);
        },
        error: function (xhr, textStatus, err) {
            window.location = "/";
        }
    });
});

$(document).on('blur', 'textarea[id^="sp-value-"]', function (e) {
    var v = Number(this.id.replace('sp-value-', ''));
    $.each(service_properties, function (index, row) {
        if (row.id === v && row.value.localeCompare($('#sp-value-' + v).val()) !== 0) {
            $('#sp-value-' + v).after($('\
            <label  id="sp-val-confirm-label-' + v + '"><span>Do you want to change?</span></label>\
            <button id="sp-val-confirm-yes-' + v + '" class="btn btn-default">Yes</button>\
            <button id="sp-val-confirm-no-' + v + '" class="btn btn-default">No</button>'));
            $('#sp-value-' + v).attr("disabled", true);
            $("#delete-sp-btn-" + v).css("visibility", "hidden");
        }
    });
});

$(document).on('click', 'button[id^="sp-val-confirm-no-"]', function (e) {
    var v = Number(this.id.replace('sp-val-confirm-no-', ''));
    $('[id^="sp-val-confirm"]').fadeOut(250);
    $.each(service_properties, function (index, row) {
        if (row.id === v) {
            $('#sp-value-' + v).val(service_properties[index].value);
            $('#sp-value-' + v).attr("disabled", false);
            $("#delete-sp-btn-" + v).css("visibility", "visible");
        }
    });
});

$(document).on('click', 'button[id^="sp-val-confirm-yes-"]', function (e) {
    var v = Number(this.id.replace('sp-val-confirm-yes-', ''));
    $.ajax({
        async: false, type: 'POST', url: "service", timeout: 10000,
        data: {
            functionality: 'update prop',
            id: v,
            value: $('#sp-value-' + v).val()
        },
        success: function (data) {
            $.each(service_properties, function (index, row) {
                if (row.id === v) {
                    service_properties[index].value = $('#sp-value-' + v).val();
                }
            });
            $('[id^="sp-val-confirm"]').fadeOut(250);
        },
        error: function (xhr, textStatus, err) {
            window.location = "/";
        }
    });
    $('#sp-value-' + v).attr("disabled", false);
});

$(document).on('click', '#new-sp', function (e) {
    $("#new-sp").css("visibility", "hidden");
    row = $("<tr id='sp-new-div'></tr>");
    col1 = $('<input id="sp-new-key" class="form-control" type="text" name="key" placeholder="key"><br>\
        <textarea id="sp-new-value" dir="RTL" class="form-control" rows="5" style="resize: none" lang="ar" placeholder="value"></textarea><br>\
        <label id="sp-new-label"><span>Do you want to add?</span></label>\
            <button id="sp-new-confirm-yes" class="btn btn-default">Yes</button>\
            <button id="sp-new-confirm-no" class="btn btn-default">No</button>');
    row.append(col1).prependTo("#sp-table");
});

//sp-new-confirm-yes
//sp-new-confirm-no
//sp-new-value
//sp-new-label

$(document).on('click', '#sp-new-confirm-yes', function (e) {
    var sp_new_key = $('#sp-new-key').val();
    var sp_new_value = $('#sp-new-value').val();
    $.ajax({
        async: false, type: 'POST', url: "service", timeout: 10000,
        data: {
            functionality: 'add prop',
            service: service_selected,
            key: sp_new_key,
            value: sp_new_value
        },
        success: function (data) {
            $("#new-sp").css("visibility", "visible");
            $('#sp-new-key').remove();
            $('#sp-new-value').remove();
            $('#sp-new-label').remove();
            $('#sp-new-confirm-yes').remove();
            $('#sp-new-confirm-no').remove();
            $('#sp-table').prepend('<tr><td>\
                    <label id="sp-key-' + data + '">' + sp_new_key + '</label>\
                    <textarea id="sp-value-' + data + '" dir="RTL" class="form-control" rows="5" style="resize: none" lang="ar">' + sp_new_value + '</textarea>\
                    <button id="delete-sp-btn-' + data + '" class="btn btn-danger btn-xs">\
                                <span class="glyphicon glyphicon-remove"></span></button>\
                    </td></tr>');
            service_properties.push({id: Number(data), service_id: service_selected, key: sp_new_key, value: sp_new_value});
        },
        error: function (xhr, textStatus, err) {
            window.location = "/";
        }
    });
});

$(document).on('click', '#sp-new-confirm-no', function (e) {
    $('#sp-new-div').remove();
    $("#new-sp").css("visibility", "visible");
});

$(document).on('click', 'button[id^="delete-srv-"]', function (e) {
    service_selected = Number(this.id.replace('delete-srv-', ''));
});

$(document).on('click', '#delete-service-confirmation', function (e) {
    $('#modal-delete-srv').modal('toggle');
    $.ajax({
        async: false, type: 'POST', url: "service", timeout: 10000,
        data: {
            functionality: 'delete srv',
            service: service_selected
        },
        success: function (data) {
            fillServiceTable();
        },
        error: function (xhr, textStatus, err) {
            window.location = "/";
        }
    });
});

$("select[id='service-type']").change(function (e) {
    service_type_selected = this.value;
});