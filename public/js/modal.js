var closeModal, getCompanyInfo, makeReservation, openModal, user;

var modalId = '#exampleModal';
var form;
var eventHelper = new EventHelper();
var companyId;
var user;

$(window).on('load', function() {
	form = $('#form-reserve');
	bindEvents();
});

function saveCompanyId(ev) {
	// ev - событие открытия модуля
	var button = $(event.target);
	companyId = button.data('companyid');

	//fills model header
	// why here? f*ck you!
	$(modalId).find('form').prepend('<h3 class="form-heading">' + button.data('name') + '</h3>')
}

function enableValidator() {
	form.validator();
	eventHelper.addEvent(form.validator(), 'submit', validateForm);
	// form.validator().on('submit', validateForm)
}

function validateForm(ev) {
	form.validator('validate');
	if (!ev.isDefaultPrevented()) {
		ev.preventDefault();
		makeReservation();
	}
}

function makeReservation() {
	var data = form.serialize();
	data += '&client='+user.id+'&company='+companyId;
	return $.ajax({
		url: '/request/create',
		method: 'POST',
		data: data,
		complete: function(jqXHR, status) {
			var msgType;
			if (status === 'success') {
				msgType = "info";
				closeModal();
			} else {
				msgType = 'warn';
			}
			$.notify(jqXHR.responseJSON, msgType);
		}
	});
}

closeModal = function() {
	$(modalId).modal('hide');
};

function removeFromHeading() {
	$(modalId).find('.form-heading').remove();
	$(modalId + ' #date').val('');
	$(modalId + ' #time').val('');
	$(modalId + ' #persons').val('');
	$(modalId + ' #message-text').val('');
}

function bindEvents() {
	eventHelper.addEvent($(modalId), 'show.bs.modal', saveCompanyId);
	eventHelper.addEvent($(modalId), 'shown.bs.modal', enableValidator);
	eventHelper.addEvent($(modalId), 'hide.bs.modal', removeFromHeading);
	eventHelper.addEvent($(modalId), 'hidden.bs.modal', () => {
		eventHelper.removeEvent(form.validator(), 'submit')
		form.validator('destroy');
	});
	eventHelper.addEvent($('#btn-reserve'), 'click', () => {
		form.submit();
	});
	eventHelper.addEvent($('#clear'), 'click', () => {
		$('#searchinput').val('');
	});
}

function saveUser(_user) {
	user = _user;
};