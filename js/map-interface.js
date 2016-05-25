var apiKey = require('./../.env').apiKey;
var initMap = require('./../js/map.js').initMap;

// $(document).ready(function() {
//   $('#mode-selector').click(function() {
//     var origin = $('#origin-input').val();
//     var destination = $('#destination-input').val();
//     var output = initMap()
//
//     $.get('https://maps.googleapis.com/maps/api/js?key='+ apiKey + '&libraries=places&callback=initMap').then(function(response) {
//
//       console.log(JSON.stringify(response));
//     }).fail(function(error) {
//       $('.showMap').text(error.responseJSON.message);
//     });
//   });
// });
