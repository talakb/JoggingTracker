'use strict'

/*My GMap Controllers */
var MyGMapAppControllers = angular.module('MyGMapAppControllers', []);

//create a controller called "MyGMapController" 
//inject $scope and mapRouteRender  
MyGMapAppControllers.controller("MyGMapController",['$scope', 'mapRouteRender',
function MyGMapController($scope, mapRouteRender){
	
		//latLng obj 	
		var latLng ={
					lat:0,
					lng:0
					};
					
		//update latLng based on user's current location 
		getUserLocation(function(latLng)
			 {	
				$scope.latLng = latLng; 
				$scope.$digest();
			 });

		
		var myPathHistory = [];
		$scope.myPathHistory = myPathHistory; 								
		
		var locTimerService;
		//get location with time interval of 5 seconds 		
		$scope.startLocationTracking = function(){
			locTimerService = setInterval(function(){
								//store <timestamp, latLng> on localStorage 
								var d = new Date();
								var key = d.toJSON();	
								var value = JSON.stringify(latLng);
								//store lat lng info on localstorage (time stamp as key and lat lng as value) 
								localStorage.setItem(key, value); 
				}, 5000);				
		}
		   
	   //stop location tracking and save the lists of lat lng as new path  
	   $scope.endLocationTracking = function(){		   
		   //stop timer 
			clearTimeout(locTimerService);		
			//save route to localStorage  
			mapRouteRender.saveRoute();			
	   }
		   
	   //clear localStorage 
	   $scope.clear = function(){
			localStorage.clear();
	   }
		   
		//add new div element to display all the maps of currently logged in user    
		$scope.myListOfPath = function(){	  
			for (var i = 0; i < localStorage.length; i++) {
				myPathHistory.push(localStorage.key(i));
			}	
					
		}
		
		   
	   //display lists of route from localStorage 	   
	   $scope.showMyRoute = function(event){
	   
	        var pathId;
			pathId = event.target.id;
			
			var listLatLng;
			listLatLng = localStorage.getItem(pathId);
			var mapOptions = {
			zoom: 10
			}
	
		  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
		  mapRouteRender.renderRoute(listLatLng, map); 			
	   }
	   
	   
	   	//get the current location of the user  
		function getUserLocation() {
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(setPosition);
				}
			else{
				alert("navigator.geolocation error.");
				}
		}
		
		function setPosition(position) {		
			latLng.lat = position.coords.latitude; 
			latLng.lng = position.coords.longitude;				
		}
		   
	   
		   											
}]);
	
 //create a service or factory that implements and return mapRouteRender obj. 
 MyGMapAppControllers.service('mapRouteRender', function(){
		//mapLoader Obj. 
		var mapRouteRender = {};
	 //   var currentLatLng;
		

	
			
			
		//save lat lng stored on localStorage as <Path<timestamp>, listOfPath>
		mapRouteRender.saveRoute = function(){
			var route = ''; 
			var timeStamp = []; 
			
			var d = new Date();
			var key = d.toJSON();
			
			// push timestamp to the array 			
			for (var i = 0; i < localStorage.length; i++) {
				if(localStorage.key(i).indexOf('Path') == -1){
					timeStamp.push(localStorage.key(i)); 
				}				
			}
			
			if(timeStamp.length == 0)
			{
				alert('no route log added yet');
				return; 
			}
				
			//sort (N.B: localStorage stores <key,value> randomly, but we need to access the locations based on timestamp)
			timeStamp.sort();
			
			//create new path			
			for(var j=0; j<timeStamp.length; j++){
			 var locJsonStr = JSON.parse(localStorage.getItem(timeStamp[j]));						
			 route += '{' + '\"lat":' + locJsonStr.lat + ',\"lng":' + locJsonStr.lng + '},'; 			
			}
			
			route = '{\"path":[' + route.substring(0, route.length - 1) + ']}';
				
			//save to localStorage as <Path_timestamp, lists_of_latlng> 
			localStorage.setItem('Path_' + key, route);

			//remove individual track history from localStorage 
			for (var key in timeStamp ) {	
				if(localStorage.getItem(timeStamp[key]) !== null){
				localStorage.removeItem(timeStamp[key]);
				}				
			}			
		
		}
		//render the map route  
		mapRouteRender.renderRoute = function(localStorageArr, map){
		
		//google maps API services 	
		var directionsDisplay = new google.maps.DirectionsRenderer();
		var directionsService = new google.maps.DirectionsService();
		
		 //read start and end location 
		var pathJson = JSON.parse(localStorageArr);	
		var listOfLatLng = pathJson.path; 
	 	var startLatLng = new google.maps.LatLng(listOfLatLng[0].lat, listOfLatLng[0].lng); 
		var endLatLng = new google.maps.LatLng(listOfLatLng[listOfLatLng.length - 1].lat, listOfLatLng[listOfLatLng.length - 1].lng);
		  
		//an array to store route points 
		var waypts = [];
		
		for (var latLng in listOfLatLng){
				var locLatLng = new google.maps.LatLng(listOfLatLng[latLng].lat , listOfLatLng[latLng].lng); 
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
			alert(" DirectionsStatus Error");
		}
	  });	   
	}		

 return mapRouteRender; 
 
 });