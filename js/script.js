/* Author: Matjaž Horvat

*/

var bugs = {};

$(function() {

  function render() {
    for (var locale in bugs) {
      var ids = [];
      $(bugs[locale]).each(function() {
        ids.push(this.id);
      });
      $('table').append(
        '<tr class="' + locale + '"><td>' +
        '<a href="https://bugzilla.mozilla.org/show_bug.cgi?id=' + ids.join(', ') + '">' + locale + '</a>' +
        '</td></tr>');
    }
  }

  /* Parses locales and categories from bug summary:
* "[locale code][and][banner][categories] And some summary text left"
*/

  function parse(summary) {
    var meta = {};
    temp = summary.split(" ");
    parameters = temp[0];
    meta.summary = temp.slice(1).join(" ");
    var params = [];
    $(parameters.split("[")).each(function() {
      var tempParams = this.split("]");
      for (var i = 0; i < tempParams.length; i++) {
        if (tempParams[i] == "") {
          tempParams.splice(i, 1);
          i--;
        }
      }
      if (tempParams.length >= 1){
          params.push(tempParams.join(""));
      }
    });
    meta.locale = params[0];
    meta.categories = params.slice(1);
    /* testing
console.log("params:" + params);
console.log("locale: " + meta.locale + "; categories: " + meta.categories + "; summary: " + meta.summary);
*/
    return meta;
  }

  function add(bug) {
    var meta = parse(bug.summary);
    if (meta.categories.length === 0) {
      meta = ["other"];
    }

    var tempObject = {
      categories: meta.categories,
      summary: meta.summary
    },
    bugObject = {};
    bugObject[bug.id] = tempObject;

    if (!bugs[meta.locale]) {
      bugs[meta.locale] = bugObject;
    } else {
      bugs[meta.locale][bug.id] = tempObject;
    }
  }
  
  $.ajax({

    /* Define a URL for API
Response contains the bug with all the properties
*/
    
    url: 'https://api-dev.bugzilla.mozilla.org/0.9/bug',
    dataType: 'json',
    data: {
      product: 'Websites',
      component: 'affiliates.mozilla.org banners'
    },
    success: function(data) {
      /* if we get successful fetch call add() for each bug in response */
      $(data.bugs).each(function() {
        add(this);
      });
      render();
    }
  });
});