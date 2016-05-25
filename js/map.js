var map;

function initMap() {
  geocoder = new google.maps.Geocoder();
  var origin_place_id = null;
  var destination_place_id = null;
  var travel_mode = google.maps.TravelMode.WALKING;
  map = new google.maps.Map(document.getElementById('map'), {
    // mapTypeControl: false,
    center: {lat: 45.55252525134013, lng: -122.71728515625},
    zoom: 13
  });
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  var origin_input = document.getElementById('origin-input');
  var destination_input = document.getElementById('destination-input');
  var modes = document.getElementById('mode-selector');

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(modes);

  var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
  origin_autocomplete.bindTo('bounds', map);
  var destination_autocomplete =
  new google.maps.places.Autocomplete(destination_input);
  destination_autocomplete.bindTo('bounds', map);

  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  function setupClickListener(id, mode) {
    var radioButton = document.getElementById(id);
    radioButton.addEventListener('click', function() {
      travel_mode = mode;
      route(origin_place_id, destination_place_id, travel_mode,
        directionsService, directionsDisplay);
      });
    }
    setupClickListener('changemode-walking', google.maps.TravelMode.WALKING);
    setupClickListener('changemode-transit', google.maps.TravelMode.TRANSIT);
    setupClickListener('changemode-driving', google.maps.TravelMode.DRIVING);

    function expandViewportToFitPlace(map, place) {
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
    }

    origin_autocomplete.addListener('place_changed', function() {
      var place = origin_autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
      }
    expandViewportToFitPlace(map, place);

    // If the place has a geometry, store its place ID and route if we have
    // the other place ID
    origin_place_id = place.place_id;
    route(origin_place_id, destination_place_id, travel_mode,
      directionsService, directionsDisplay);
    });

    destination_autocomplete.addListener('place_changed', function() {
      var place = destination_autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
      return;
    }
    expandViewportToFitPlace(map, place);

    // If the place has a geometry, store its place ID and route if we have
    // the other place ID
    destination_place_id = place.place_id;
    route(origin_place_id, destination_place_id, travel_mode,
      directionsService, directionsDisplay);
    });

    function route(origin_place_id, destination_place_id, travel_mode,
      directionsService, directionsDisplay) {
        if (!origin_place_id || !destination_place_id) {
          return;
        }
      directionsService.route({
        origin: {'placeId': origin_place_id},
        destination: {'placeId': destination_place_id},
        travelMode: travel_mode
      }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    }
    //traffic layer
    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
    //transit layer
    var transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);


    panorama = map.getStreetView();

}

var longLatOutput;
var panorama;
var geocoder;

function toggleStreetView() {
  var toggle = panorama.getVisible();
  if (toggle === false) {
    panorama.setVisible(true);
  } else {
    panorama.setVisible(false);
  }

  var address = document.getElementById('origin-input').value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
      longLatOutput = results[0].geometry.location;
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
    console.log(longLatOutput);
    panorama.setPosition(longLatOutput);
    panorama.setPov(/** @type {google.maps.StreetViewPov} */({
      heading: 265,
      pitch: 0
    }));
  });

}

$(document).ready(function() {
  $(window).load(initMap);
  $("#floating-panel").click(toggleStreetView);
});
