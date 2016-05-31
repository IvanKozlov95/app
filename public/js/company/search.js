$(window).load(() => {
	var count = 0;
	var lastSearch;
	$('#searchlist').btsListFilter('#searchinput', {
	sourceTmpl: tmp,
		sourceData: function(text, callback) {
			return $.getJSON('search/?name='+text+'&start=0&end=10', function(json) {
				count += json.length;
				lastSearch = text;
				$('.btn-more').show();
				callback(json);
			});
		},
		resetOnBlur: false
	});

	$('.btn-more').hide();
	$('.btn-more').click(() => {
		$.getJSON('search/?name='+lastSearch+'&start='+count+'&end='+(count+10), function(json) {
			count += json.length;
			addCompanies(json);
		});
	})
})

function addCompanies(companies) {
	companies.forEach((el) => {
		var newItem = tmp;
		for (field in el) {
			var regex = new RegExp('{'+field+'}','i');
			newItem = newItem.replace(regex, el[field]);
		}
		$('#searchlist').append(newItem);
	})
}

var tmp = '<div class="company-div list-group-item">\
					<div class="row">\
						<div class="col-sm-6">\
							<h3 list-group-item-heading" style="display:inline-block;">\
								{name}\
							</h3>\
							<a href="/company/?id={_id}"> \
								<span class="btn glyphicon glyphicon-info-sign list-group-item">\
								</span>\
							</a>\
							<a id="modal-link"> \
								<span class="btn glyphicon glyphicon glyphicon-edit list-group-item" data-toggle="modal" data-target="#exampleModal" data-companyid={_id} data-name={name}>\
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
				</div>'