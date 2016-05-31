var displayedForm, enableValidator, setBg, showFrom;

displayedForm = null;

$(document).ready(function() {
  enableValidator($('form'));

  $('[name="phone"]').change(function(ev) {
    var newVal, regexp, target;
    target = $(ev.target);
    regexp = /^([1-9])\s?([0-9]{3})\s?([0-9]{3})\s?([0-9]{2})\s?([0-9]{2})$/;
    newVal = target.val().replace(regexp, '$1 ($2) $3-$4-$5');
    return target.val(newVal);
  });
  return $('.btn-submit').click(function() {
    return $(this).closest('form').submit();
  });
});

enableValidator = function(form) {
  form.validator();
  return form.validator().on('submit', function(ev) {
    var formData;
    formData = new FormData(this);
    if (!ev.isDefaultPrevented()) {
      $.ajax({
        url: '/register',
        method: 'POST',
        data: $(this).serialize(),
        // contentType: false,
        // processData: false,
        statusCode: {
          400: function() {
            return $.notify("Current login is already taken", "warn");
          },
          200: function() {
            return window.location.href = '/';
          }
        }
      });
      return ev.preventDefault();
    }
  });
};
