'use strict'

/*My GMap Controllers */

var MyGMapAppControllers = angular.module('MyGMapAppControllers', []);

//create a controller called "MyGMapController" 
//inject $scope and mapLoaderService  
MyGMapAppControllers.controller("MyGMapController",['$scope', 'mapLoaderService', 'mapRouteRender',
function MyGMapController($scope, mapLoaderService, mapRouteRender){
	
	//latLng obj 	
	var latLng ={
				lat:0,
				lng:0
				};	
				
	$scope.latLng = latLng; 
	
	var mapOptions = {
	zoom: 10
	}

	//instantiate map 
	var map = new google.maps.Map(document.getElementById('map'), mapOptions);

	
	
	mapLoaderService.geocode(function(latLng){	
												$scope.latLng = latLng; 
												$scope.$digest();
											 }, 
												latLng, map);
	
		//get timestamp 
		var d = new Date();
		var key = d.toJSON();
		//store lat lng info on localstorage (time stamp as key and lat lng as value) 	
		$scope.saveLocation = function(){
		//latLng.lat = 39.9726029;
		//latLng.lng = -83.0444366;
			var value = JSON.stringify(latLng);
				localStorage.setItem(key, value); 
		   }
		   
		   //clear local storage 
		   $scope.clear = function(){
			localStorage.clear();
		   }
		   
		      //clear local storage 
		   $scope.showMyRoute = function(){
			  mapRouteRender.renderRoute(localStorage, map); 
		   }

												
}]);
	
 //create a service or factory that implements and return mapLoader obj. 
 MyGMapAppControllers.service('mapLoaderService', function(){
	

		//mapLoader Obj. 
		var myMapLoader = {};
		 

		//read geocode response as JSON 
		myMapLoader.geocode =  function(latLngCallBack, latLng, map){
		//get current location of the user 
		getCurrentLocation();
		
		function getCurrentLocation() {
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(setPosition);
				}
			else{
				alert("Error.");
				}
		}
	
		function setPosition(position) {
		
		latLng.lat = position.coords.latitude; 
		latLng.lng = position.coords.longitude;
		latLngCallBack(latLng);

		//render the map 
		myMapLoader.render(latLng, map);						
		}		
			
	}
		
	//render the map 
	myMapLoader.render = function(latLon, map){
		   map.setCenter(latLon);
		   var marker = new google.maps.Marker({
			  map: map,
			  position: latLon
		  }); 
		} 

	  
	
	return myMapLoader; 
 
 });
 
 
 //create a service or factory that implements and return mapRouteRender obj. 
 MyGMapAppControllers.service('mapRouteRender', function(){
	
	
	//mapLoader Obj. 
	var mapRouteRender = {};
	 				
	//render the map route  
	mapRouteRender.renderRoute = function(localStorageArr, map){
		var directionsDisplay = new google.maps.DirectionsRenderer();
		var directionsService = new google.maps.DirectionsService();
	
	
		 //read start and end location 
		  var startJsonStr = JSON.parse(localStorage.getItem(localStorageArr.key(0)));		 
	 	  var startLatLng = new google.maps.LatLng(startJsonStr.lat, startJsonStr.lng); 

		  var endJsonStr = JSON.parse(localStorage.getItem(localStorageArr.key(localStorageArr.length - 1)));
		  var endLatLng = new google.maps.LatLng(endJsonStr.lat, endJsonStr.lng); 		  
		  
		  //an array to store route points 
		  var waypts = [];
		  
		//add locations stored on localStorage
		for ( var i = 0, len = localStorageArr.length; i < len; ++i ) {
			var locJsonStr = JSON.parse(localStorage.getItem(localStorageArr.key(i)));
			var locLatLng = new google.maps.LatLng(locJsonStr.lat, locJsonStr.lng); 			
			waypts.push({			
				location:locLatLng,
				stopover:true});

			}

		var request = {
			  origin: startLatLng,
			  destination: endLatLng,
			  waypoints: waypts,
			  optimizeWaypoints: true,
			  travelMode: google.maps.TravelMode.WALKING
		  };
	  
		directionsService.route(request, function(response, status) {
		 if (status == google.maps.DirectionsStatus.OK) {
		  directionsDisplay.setDirections(response);
		  var route = response.routes[0];
		  directionsDisplay.setMap(map);      
		}
		else{
		alert("Error");
		}
	  });
	   
	} 

 return mapRouteRender; 
 
 });
 


 
 