$(function() {
  $('.contact-form input:button').click(function() {
    var form = $(this).parents('.contact-form');
    var form_data = form.serializeArray();
    var data = {};
    for (var i=0; i<form_data.length; i++) {
      data[form_data[i].name] = form_data[i].value;
    }
    var doc = {
      from: data.email,
      from_name: data.name,
      text: data.text,
      type: 'mail',
      status: 'spool'
    };
    $.ajax({
      url: location.href,
      type: 'POST',
      processData: false,
      data: JSON.stringify(doc),
      contentType: 'application/json',
      success: function() {
        form.parents('.form-container').html('Message sent succcessfully.');
      },
      error: function(xhr, textStatus, errorThrown) {
        alert('Error: ' + JSON.parse(xhr.responseText).reason);
      }
    });
    return false;
  });
});
