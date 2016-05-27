table = {}

$(window).load () ->
	table = $ '#fields'
	# $.fn.editable.defaults.mode = 'inline'
	$('td a').editable()
	bindEvents()

bindEvents = () -> 
	eventHelper = new EventHelper()
	eventHelper.addEvent $('#add-field'), 'click', addNewRow
	eventHelper.addEvent $('#btn-save'), 'click', save


addNewRow = () -> 
	tr = $ '<tr>'
	tdName = $ '<td>'
		.attr {
			class: 'name'
		}
		.append createEditableField {
			type: 'text',
			placeholder: 'Название'
		}
	tdType = $ '<td>'
		.attr {
			class: 'type'
		}
		.append createEditableField {
			type: 'select',
			title: 'Тип',
			value: 1,
			source: [
				{ value: 1, text: 'Текст' },
				{ value: 2, text: 'Дата' },
			]
		}
	tdView = $ '<td>'
		.attr {
			class: 'view'
		}
		.append createEditableField {
			type: 'select',
			title: 'Вид',
			value: 1,
			source: [
				{ value: 1, text: 'Строка' },
				{ value: 2, text: 'Текстовое поле' },
				{ value: 3, text: 'Картинка' },
				{ value: 4, text: 'Дата' },
			]
		}
	tr.append tdName, tdType, tdView
	table.append tr

createEditableField = (options) ->
	a = $ '<a>'
		.attr {
			href: '#'
		}
		.editable options
	if options.type == 'text'
		a.text 'Название'
	a

save = () -> 
	fields = []
	rows = table.find 'tbody tr'
	for row in rows
		fields.push {
			name: $(row).find('.name').text()
			type: $(row).find('.type').text()
			view: $(row).find('.view').text()
		}

	formData = new FormData $('#request-info')
	url = if formData.id then '/requestInfo/update' else '/requestInfo/create'
	$.ajax {
		url: url,
		method: 'POST',
		data: {
			fields: fields,
			name: $('#request-name').val(),
			description: $('#request-description').val()
		}
	}