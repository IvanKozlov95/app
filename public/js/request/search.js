var eventHelper = new EventHelper();

$(window).load(() => {
	eventHelper.addEvent($('.search-query'), 'change', search);
	eventHelper.addEvent($('.search-query-date'), 'change', searchByDate)
})

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

var xhr;

function searchByDate(ev) {
	var $table = $('table');
	var $target = $(ev.target);
	var data = {
		date: $target.val(),
		company: $target.data('company')
	}

    if (xhr) {
      xhr.abort();
    }
	xhr = $.ajax({
		url: '/request/bydate/',
		method: 'GET',
		data: data,
		complete: function(jqXHR, status) {
			if (status == 'success') {
				fillTable($table, jqXHR.responseJSON);
			} else {
				$.notify(jqXHR.responseJSON, 'warn');
			}
		 	xhr = null;
		}
	});
}

function fillTable(table, json) {
	// clear the table
	$(table).find('tbody').empty();
	for (i in json) {
		table.append(createRow(json[i]));
	}
}

function createRow(data) {
	var tr = $('<tr>');
	var date = new Date(data.date);
	$('<td>')
		.append($('<p>')
			.text(date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear() || 'Нет данных'))
		.appendTo(tr);
	$('<td>')
		.append($('<p>')
			.text(data.time || 'Нет данных'))
		.appendTo(tr);
	$('<td>')
		.append($('<p>')
			.text((data.client && data.client.name) || 'Нет данных'))
		.appendTo(tr);
	$('<td>')
		.append($('<a>')
			.attr('href', '/request/info/?id='+data._id)
			.append($('<span>')
				.addClass('btn glyphicon glyphicon-info-sign')))
		.appendTo(tr);
	return tr;
}