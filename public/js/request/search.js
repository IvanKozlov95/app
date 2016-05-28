var eventHelper = new EventHelper();

$(window).load(() => {
	bindEvents();
})

function bindEvents() {
	eventHelper.addEvent($('.search-query'), 'change', search)
}

function search(ev) {
	var table = $('table');
	var regex = new RegExp(ev.target.value, 'i');

	$.each(table.find('tbody tr'), (ind, tr) => {
		var display = false;
		$.each($(tr).find('td'), (ind, td) => {
			var text = $(td).find('p').text();
			if (text.match(regex)) {
				display = true;
				return;
			}
		})

		if (!display) {
			$(tr).hide('10');
		} else {
			$(tr).show('10')
		}
	})
}