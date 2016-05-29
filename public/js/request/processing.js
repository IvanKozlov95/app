var eventHelper = new EventHelper();
var xhr;
var queue = [];

$(window).load(() => {
	eventHelper.addEvent($('.glyphicon-ok'), 'click', submitRequest);
	eventHelper.addEvent($('.glyphicon-remove'), 'click', rejectRequest);
})

function submitRequest(ev) {
	var $target = $(ev.target);
	var id = $target.data('id');
	var $tr = $target.closest('tr');
	var date = $tr.find('input[type=date]').val()
	var time = $tr.find('input[type=time]').val()

	$.ajax({
		url: '/request/submit',
		method: 'POST',
		data: {
			request: id,
			data: {
				date: date,
				time: time
			}
		},
		complete: (jqXHR, status) => {
			if (status == 'success') {
				$.notify(jqXHR.responseJSON, 'info');
				$tr.remove();
			} else {
				$.notify(jqXHR.responseJSON, 'warn')
			}
		}
	});
}

function rejectRequest(ev) {
	var $target = $(ev.target);
	var id = $target.data('id');
	var $tr = $target.closest('tr');

	$.ajax({
		url: '/request/reject',
		method: 'POST',
		data: {
			request: id
		},
		complete: (jqXHR, status) => {
			if (status == 'success') {
				$.notify(jqXHR.responseJSON, 'info');
				$tr.remove();
			} else {
				$.notify(jqXHR.responseJSON, 'warn')
			}
		}
	});
}
