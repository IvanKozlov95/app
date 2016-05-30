$(window).load(() => {
	$('#searchlist').btsListFilter('#searchinput', {
	sourceTmpl: '<div class="company-div list-group-item">\
					<div class="row">\
						<div class="col-sm-4">\
							<h3 list-group-item-heading" style="display:inline-block;">\
								{name}\
							</h3>\
							<a href="/company/?id={_id}"> \
								<span class="btn glyphicon glyphicon-info-sign list-group-item">\
								</span>\
							</a>\
							<a id="modal-link"> \
								<span class="btn glyphicon glyphicon glyphicon-edit list-group-item" data-toggle="modal" data-target="#exampleModal" data-companyid={_id}>\
								</span>\
							</a>\
						</div>\
					</div>\
					<div class="row">\
						<div class="col-sm-9">\
							<p class="list-group-item-text">\
								{description}\
							</p>\
						</div>\
						<div calss="col-sm-2" >\
							<img src="/avatars/{avatar}" height="150" width="150" />\
						</div>\
					</div>\
				</div>',
		sourceData: function(text, callback) {
			return $.getJSON('search/?name='+text, function(json) {
				callback(json);
			});
		},
		resetOnBlur: false
	});
})
