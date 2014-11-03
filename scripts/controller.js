'use strict'

/*My GMap Controllers */

var MyGMapAppControllers = angular.module('MyGMapAppControllers', []);

//create a controller called "MyGMapController" 
//inject $scope and mapLoaderService  
MyGMapAppControllers.controller("MyGMapController",['$scope', 'mapLoaderService', 
  function MyGMapController($scope, mapLoaderService){
<<<<<<< HEAD
		
		//latLng obj 
		var latLng={
					lat:0,
					lng:0
					};	
					
		var map; 
		var mapOptions = {
		zoom: 10
		}
					
		map = new google.maps.Map(document.getElementById('map'), mapOptions);
		$scope.latLng = latLng; 
		
		mapLoaderService.geocode(function(latLng){	
													$scope.latLng = latLng; 
													$scope.$digest();}, 
													latLng);	
	}]);
		
=======
		var address = {};		
		address.city = "Columbus";	
		address.state = "OH";
		$scope.address =  address; 
		
		var gmapApiUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" 
		
		//load map ('search' button click) 
		$scope.showMap = function(){
		mapLoaderService.geocode(function(){}, address, gmapApiUrl);			
		}
	 }]);
	 
>>>>>>> f2546078d036372b92fb6d88e50563973beadf05
	 //create a service or factory that implements and return mapLoader obj. 
	 MyGMapAppControllers.service('mapLoaderService', function(){
		var mapOptions = {
		zoom: 10,
		center: latlng
		}
  
		//instantiate map 
		map = new google.maps.Map(document.getElementById('map'), mapOptions);
		var myMapLoader = {};
<<<<<<< HEAD
		
		
		 

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
		
				return latLng;
=======

		//read geocode response as JSON 
		myMapLoader.geocode =  function(renderCallback, address, gmapApiUrl){
			 var url =  gmapApiUrl + address.city + " , " + address.state; 
			 var mapJsonResp = $.getJSON(url, function(data){
				myMapLoader.render(getLatLon(data));
				});
>>>>>>> f2546078d036372b92fb6d88e50563973beadf05
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
<<<<<<< HEAD
		/*function getLatLon(jsonResult){
=======
		function getLatLon(jsonResult){
>>>>>>> f2546078d036372b92fb6d88e50563973beadf05
			var resultObj = JSON.stringify(jsonResult);
			var JSONobj = JSON.parse(resultObj);
			latLngRes = JSONobj.results[0].geometry.location;
			return latLngRes; 
<<<<<<< HEAD
		}*/
		
		
				
=======
		}
		
>>>>>>> f2546078d036372b92fb6d88e50563973beadf05
		return myMapLoader; 
	 
	 });
	 


	 
	 