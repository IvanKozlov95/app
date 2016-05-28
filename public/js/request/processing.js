var eventHelper = new EventHelper();

$(window).load(() => {
	bindEvents();
})

function bindEvents() {
	eventHelper.addEvent($('.glyphicon-ok'), 'click', submitRequest)
}

function submitRequest(ev) {
	ev.stopPropagation();
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
