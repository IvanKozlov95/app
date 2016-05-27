class EventHelper
	constructor: () ->

	addEvent: (element, event, handler) ->
		element.on event, handler

	removeEvent: (element, event) ->
		element.off event

window.EventHelper or= EventHelper