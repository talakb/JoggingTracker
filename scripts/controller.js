'use strict'

/*My GMap Controllers */

var MyGMapAppControllers = angular.module('MyGMapAppControllers', []);

//create a controller called "MyGMapController" 
//inject $scope and mapLoaderService  
MyGMapAppControllers.controller("MyGMapController",['$scope', 'mapLoaderService', 
function MyGMapController($scope, mapLoaderService){
	
	//latLng obj 
	
	var latLng={
				lat:0,
				lng:0
				};	
				
	$scope.latLng = latLng; 

	mapLoaderService.geocode(function(latLng){	$scope.latLng = latLng; 
												$scope.$digest();}, 
												latLng);	
}]);
	
 //create a service or factory that implements and return mapLoader obj. 
 MyGMapAppControllers.service('mapLoaderService', function(){
	var mapOptions = {
	zoom: 10
	}

	//instantiate map 
	var map = new google.maps.Map(document.getElementById('map'), mapOptions);
	
	//mapLoader Obj. 
	var myMapLoader = {};
	 

		//read geocode response as JSON 
		myMapLoader.geocode =  function(latLngCallBack, latLng){
		//get current location of the user 
		getCurrentLocation();
		
		function getCurrentLocation() {
			navigator.geolocation.getCurrentPosition(setPosition);
		}
	
		function setPosition(position) {
		
		latLng.lat = position.coords.latitude; 
		latLng.lng = position.coords.longitude;
		latLngCallBack(latLng);

		//render the map 
		myMapLoader.render(latLng);						
		}		
			
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
	/*function getLatLon(jsonResult){
		var resultObj = JSON.stringify(jsonResult);
		var JSONobj = JSON.parse(resultObj);
		latLngRes = JSONobj.results[0].geometry.location;
		return latLngRes; 
	}*/
	
	
			
	return myMapLoader; 
 
 });
 


 
 