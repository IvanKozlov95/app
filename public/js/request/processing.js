var eventHelper = new EventHelper();

$(window).load(() => {
	eventHelper.addEvent($('.glyphicon-ok'), 'click', submitRequest);
	eventHelper.addEvent($('.glyphicon-remove'), 'click', rejectRequest);
})

function submitRequest(ev) {
	var $target = $(ev.target);
	var id = $target.data('id');
	var $tr = $target.closest('tr');

	$.ajax({
		url: '/request/submit',
		method: 'POST',
		data: {
			id: id
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
			id: id
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
