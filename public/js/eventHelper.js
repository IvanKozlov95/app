(function() {
  var EventHelper;

  EventHelper = (function() {
    function EventHelper() {}

    EventHelper.prototype.addEvent = function(element, event, handler) {
      return element.on(event, handler);
    };

    EventHelper.prototype.removeEvent = function(element, event) {
      return element.off(event);
    };

    return EventHelper;

  })();

  window.EventHelper || (window.EventHelper = EventHelper);

}).call(this);
