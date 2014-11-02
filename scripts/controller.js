'use strict'

/*My GMap Controllers */

var MyGMapAppControllers = angular.module('MyGMapAppControllers', []);

//create a controller called "MyGMapController" 
//inject $scope and mapLoaderService  
MyGMapAppControllers.controller("MyGMapController",['$scope', 'mapLoaderService', 
  function MyGMapController($scope, mapLoaderService){
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
	 
	 //create a service or factory that implements and return mapLoader obj. 
	 MyGMapAppControllers.service('mapLoaderService', function(){
		var mapOptions = {
		zoom: 10,
		center: latlng
		}
  
		//instantiate map 
		map = new google.maps.Map(document.getElementById('map'), mapOptions);
		var myMapLoader = {};

		//read geocode response as JSON 
		myMapLoader.geocode =  function(renderCallback, address, gmapApiUrl){
			 var url =  gmapApiUrl + address.city + " , " + address.state; 
			 var mapJsonResp = $.getJSON(url, function(data){
				myMapLoader.render(getLatLon(data));
				});
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
		
		return myMapLoader; 
	 
	 });
	 


	 
	 