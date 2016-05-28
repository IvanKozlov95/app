table = {}
types = [
	{ value: 1, text: 'Текст' },
	{ value: 2, text: 'Дата' },
]

$(window).load () ->
	table = $ '#fields'
	# $.fn.editable.defaults.mode = 'inline'
	$('td a').editable()
	bindEvents()

bindEvents = () -> 
	eventHelper = new EventHelper()
	eventHelper.addEvent $('#add-field'), 'click', addNewRow
	eventHelper.addEvent $('#btn-save'), 'click', save

addNewRow = (field) -> 
	table = $ '#fields'
	tr = $ '<tr>'
	tdName = $ '<td>'
		.attr {
			class: 'name'
		}
		.append createEditableField {
			type: 'text',
			name: if field?.name? then field.name else 'Название'
		}
	tdType = $ '<td>'
		.attr {
			class: 'type'
		}
		.append createEditableField {
			type: 'select',
			title: 'Вид',
			value: if field?.view?.val then field.view.value else 1,
			source: window.views
		}
	td = $ '<td>'
		.append $('<a>').attr({ href: '#' }).append $('<span>').addClass('glyphicon glyphicon-remove')
	td.click (ev) ->
		$(ev.target).closest('tr').hide 100, () ->
			this.remove()
	tr.append tdName, tdType, td
	table.append tr

createEditableField = (options) ->
	a = $ '<a>'
		.attr {
			href: '#'
		}
		.editable options
	if options.type == 'text'
			a.text options.name 
	a

save = () -> 
	fields = []
	rows = table.find 'tbody tr'
	for row in rows
		fields.push {
			name: $(row).find('.name').text()
			type: $(row).find('.type').text()
		}

	$.ajax {
		url: '/request/type/save',
		method: 'POST',
		data: {
			fields: fields,
			name: $('#request-name').val(),
			description: $('#request-description').val()
		},
		complete: (jqXHR, status) -> 
			alert jqXHR.responseText
	}

window.fillTable = (fields) ->
	# TODO
	for field in fields
		addNewRow field