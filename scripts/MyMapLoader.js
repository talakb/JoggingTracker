"use strict";
var geocoder = new google.maps.Geocoder();
var latlng = new google.maps.LatLng(39.9611755, -82.99879420000002);
var latLngRes = null;
var mapOptions = {
    zoom: 10,
    center: latlng
  }
  
//instantiate map 
map = new google.maps.Map(document.getElementById('map'), mapOptions);

//myMapLoader object 


	
var myMapLoader = {};

	//read geocode response as JSON 
myMapLoader.geocode =  function(renderCallback, address){
	 var url =  "https://maps.googleapis.com/maps/api/geocode/json?address=" + address; 	  
	 var mapJsonResp = $.getJSON(url, function(data){
		myMapLoader.render(getLatLon(data));
		});
	return latLngRes; 
	}
	
	//render the map 
myMapLoader.render = function(latLon){
	   map.setCenter(latLon);
	   var marker = new google.maps.Marker({
		  map: map,
		  position: latLon
	  }); 
	} 

  
 // get lat lon from JSON result 
function getLatLon(jsonResult){

	var resultObj = JSON.stringify(jsonResult);
	var JSONobj = JSON.parse(resultObj);
	latLngRes = JSONobj.results[0].geometry.location;
	return latLngRes; 
}










