var geocoder;
var map;
 var latLngRes = null; 

function initialize() {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(39.9611755, -82.99879420000002);
  var mapOptions = {
    zoom: 10,
    center: latlng
  }
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

//add DOM Listener 
google.maps.event.addDomListener(window, 'load', initialize);


//myMapLoader object 
var myMapLoader = new Object();

	//read geocode response as JSON 
myMapLoader.geocode =  function(renderCallback, address){
	 var url =  "https://maps.googleapis.com/maps/api/geocode/json?address=" + address; 
	 var mapJsonResp = $.getJSON(url, function(data){
		latLngRes = getLatLon(data);
		myMapLoader.render(latLngRes);	 
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
	 var latLngRes = JSONobj.results[0].geometry.location;
	return latLngRes; 
	
}



