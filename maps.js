var bookshelf = require("./config.js");
var api_key = "AIzaSyDcvV-MR8pH54zhqHps9Bvitlfm83Pt4RI";
//var mapsapi = require('google-maps-api')(api_key);
var mapsAPI = 'https://maps.googleapis.com/maps/api/js?key='+api_key+'&callback=initMap'
//var myLatlng = new google.maps.LatLng(lat, lng);

var map; 

function initmap(){
	map = new Map(document.getElementById('map'), {
		center: {lat: -34.397, lng: 150.644},
		zoom: 8
	});
};


module.map = map;
module.api_key = api_key;
module.mapsAPI = mapsAPI