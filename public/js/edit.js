var xhr;
var queue = [];

$(window).load(()=> {
    $('input').keyup(updateRequest);
    $('.glyphicon-remove').click(deleteRequest);
    $('.glyphicon-ok').click(submitRequest);
})

function updateRequest(ev) {
    var $target = $(ev.target);
    var type = $target.attr('type');
    var data = {
        data: {},
        request: $target.closest('.row').attr('id')
    }
    data.data[type] = $target.val();

    if (ev.keyCode != 13) return;

    if (xhr) {
        $.notify('Предыдущий запрос выполняется', 'warn');
        queue.push(data);
        return;
    }

    sendData('/request/update', data, (jqXHR, status) => {
                    xhr = null;
                    $.notify(jqXHR.responseJSON, 'info');
                    if (queue.length > 0) {
                        sendData('/request/update', queue.shift());
                    }
                }
            );
}

function sendData(url, data, complete) {
    xhr = $.ajax({
        url: url,
        method: 'POST',
        data: data,
        complete: complete
    });
}

function deleteRequest(ev) {
    var $target = $(ev.target);
    var data = {
        request: $target.closest('.row').attr('id')
    }
    
    sendData('/request/delete', data, (jqXHR, status) => {
                    $.notify(jqXHR.responseJSON, 'info');
                    if (status == 'success') {
                        $target.closest('.row').remove();
                    }
                }
            );
}

function submitRequest(ev) {
    var $target = $(ev.target);
    var data = {
        request: $target.closest('.row').attr('id')
    }
    
    sendData('/request/submit', data, (jqXHR, status) => {
                    $.notify(jqXHR.responseJSON, 'info');
                    if (status == 'success') {
                        // todo: удалить кнопку принять, изменить статус
                        $target.closest('.status-text').text('Принята')
                        $target.closest('.buttons').remove();
                        xhr = null;
                    }
                }
            );
}


