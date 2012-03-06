/* Author: Matjaž Horvat

*/

$(function() {
  $.ajax({
  	url: 'https://api-dev.bugzilla.mozilla.org/0.9/bug', 
  	dataType: 'json',
  	data: {
      component: "affiliates.mozilla.org banners"
    }, 
  	success: function(data) {
      $(data.bugs).each(function() {
        $('#bugs').append('<li>' + this.summary + '</li>');
      });
    }
  });
});


