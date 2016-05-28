select = {}

$(window).load () ->
	select = $ '#select-requestinfo'
	bindEvents()

bindEvents = () ->
	eventHelper = new EventHelper()
	eventHelper.addEvent select, 'change', getRequestInfo

getRequestInfo = () ->
	xhr?.abort()

	$.ajax {
		url: '/requestType/info/',
		method: 'GET'
		data: {
			id: select.find('option:selected').val()
		},
		complete: ajaxComplete
	}

ajaxComplete = (jqXHR, status) ->
	if status != 'success' then return alert 'failed'

	info = jqXHR.responseJSON.requestType
	views = jqXHR.responseJSON.views

	form = $ '<form>'
		.append '<h2>' + info.name + '</h2>'
	for field, i in info.fields
		form.append createInputTag views[i].type, field.name, field.name

	$ '#form-container'
		.append form


createInputTag = (type, name, value) ->
	$ '<input>'
		.attr {
			type: type,
			name: name,
			value: value
		}
