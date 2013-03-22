//Justin Tilley
//AVF 1303
	
$("#vinbtn").on("click", function(){
	$("#carresults").empty();
	var vin = $("#vinsearch").val();
	console.log(vin);
	var a = encodeURIComponent(vin);
	$.getJSON("http://api.edmunds.com/v1/api/toolsrepository/vindecoder?vin=" + a + 
		"&api_key=saw2xy7wdxjqfueuxkv5hm8w&fmt=json&callback=?",
		function(data){
			console.log(data);
			
			$("#carresults").append("<img src='img/edmunds.png' width='50' height='50'><h2>" + data.styleHolder[0].year + " " + data.styleHolder[0].makeName + " " +
				data.styleHolder[0].modelName + "</h2><ul class='ui-grid-a'><li class='ui-block-a'>Engine: " +
				data.styleHolder[0].engineSize + " liters</li><li class='ui-block-b'>Cylinders: " + 
				data.styleHolder[0].engineCylinder + " cylinders</li><li class='ui-block-a'>Transmission: " + 
				data.styleHolder[0].transmissionType + "</li><li class='ui-block-b'>Body Type: " + data.styleHolder[0].subModels[0].identifier + 
				"</li><li class='ui-block-a'>Private Value:  $" + data.styleHolder[0].price.usedPrivateParty + "</li><li class='ui-block-b'>Trade-In Value: $" + 
				data.styleHolder[0].price.usedTradeIn + "</li>")
	});
	$("#carresults").show();	
});


$("#searchbtn").on("click", function(){
	$("#results").empty();
	var value = $("#searchfield").val();
	console.log(value);
	var n = encodeURIComponent(value);
	$.getJSON("http://search.twitter.com/search.json?q="+ n + 
				"&rpp=3&include_entities=true&callback=?",
	function(data){
		console.log(data);
		for (i=0, j=data.results.length; i<j; i++){
			$("#results").append("<li>"+"<img src='" + data.results[i].profile_image_url + "' /><h3>" + data.results[i].from_user_name +
			 "</h3><span>" + 
			data.results[i].created_at + "<img src='img/twitter.png' width='20' height='20'></span><p>" + data.results[i].text + "</p></li>");
		};
	});
	$("#results").show();
});

$("#locat").on("click", function(){
	var lng;
	var lat;
	var initialize = function(lat, lng){
		var mapOpitions = {
			center: new google.maps.LatLng(lat, lng),
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		console.log(mapOpitions);
		var map = new google.maps.Map(document.getElementById("map-canvas"), mapOpitions);
		var pos = new google.maps.LatLng(lat, lng)
		var infoWindow = new google.maps.InfoWindow({
			map: map,
			position: pos,
			content: "You Are Here!"
		})
		var request = {
			location: pos,
			radius: 1000,
			keyword: "auto repair"
		}
		var callback = function(results, status){
			if(status == google.maps.places.PlacesServiceStatus.OK){
				for(var i=0; i < results.length; i++){
					createMarker(results[i]);
					console.log(results)
				}
			}
		};
		var infowindow = new google.maps.InfoWindow();
		var createMarker = function(place){
			var placeLocat = place.geometry.location;
			var marker = new google.maps.Marker({
				map: map,
				position: place.geometry.location
			});	
			console.log(place)
			google.maps.event.addListener(marker,"click", function(){
				infowindow.setContent("<strong>" + place.name +"</strong>" + "<br>" + place.vicinity + "</br>");
				infowindow.open(map, this);
			})
		};
			var service = new google.maps.places.PlacesService(map);
			service.nearbySearch(request, callback);
			google.maps.event.trigger(map, "resize");
		};
	
	
	var onSuccess = function(position){
		lng = position.coords.longitude;
		lat = position.coords.latitude;
		initialize(lat,lng);
		$("#locat").hide();
		
	}
	var onError = function(error){
		alert(error.message)
	}
	
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
	
})



$("#accel").on("click", function(){
			document.addEventListener("deviceready", loaded, false);
			
			function loaded() {
				startWatch();
			}
			function startWatch() {
				var options = { frequency: 400 };
				watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
			}
			function stopWatch() {
				if (watchID) {
					navigator.accelerometer.clearWatch(watchID);
					watchID = null;
				}
			}
			function onSuccess(acceleration) {
				var element = document.getElementById('dynoinfo');
				element.innerHTML = "Lateral G's: " + (acceleration.x - 1);
				
				$("#dynoinfo").append("<img src=img/lateral.png id='lateral' width:50% height:50% style='display:block'>");
				$("#lateral").rotate(acceleration.x * 10);
				$("#stopd").show();
									
			}
			function onError() {
				alert('onError!');
			}
			$("#stopd").on("click", function(){
				stopWatch();
				$("#stopd").hide();
			})
})


$("#scan").on("pageinit", function(){

    $("#scanResults").hide();
    
	$("#scanbtn").on("click", function(){
		 
		var resultsList = $("#scanResults")
		
		function scanNext() {
			window.plugins.barcodeScanner.scan(scannerSuccess, scannerFailure);
		}
	
		function scannerSuccess(result) {
			console.log("scanner returned: " + JSON.stringify(result));
			
			$("#scantxt").val(result.text);
			$("#scanResults").show();
			
			//Switch to VIN search api
			$("#decode").on("click", function(){
				$.mobile.changePage($("#vehicle"));
				$("#vinsearch").val(result.text);
			
			})
		}
	
		function scannerFailure() {
			alert("Failure");
		}
		
		scanNext();
	});
	
});

$("#temp").on("pageinit", function(){
	var lat;
	var lng;
	var onSuccess = function(position){
		lng = position.coords.longitude;
		lat = position.coords.latitude;
		$.ajax({
		  url : "http://api.wunderground.com/api/e5935b1f6adad9da/geolookup/conditions/q/" + lat + "," + lng + ".json",
		  dataType : "jsonp",
		  success : function(results) {
			console.log(results)
			var location = results.location.city+","+ results.location.state;
		  var temp_f = results.current_observation.temp_f;
		  $("#weather").append("<li>"+"<img src='" + results.current_observation.icon_url + "' /><h2>" + location  +
			 "</h2><p>Temp: " + 
			temp_f + "&deg</p></li>");
			
		  }
		})
		}
	var onError = function(error){
		alert(error.message)
	}
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
	
	
	var options = { frequency: 400 };
    function compSuccess(heading) {
       console.log(heading.magneticHeading);
       var direction;
       if((heading.magneticHeading > 337.5) || (heading.magneticHeading < 22.5)){
    		direction = "North"
     	}else if((heading.magneticHeading < 337.5) && (heading.magneticHeading > 292.5)){
    		direction = "North West"
    	}else if((heading.magneticHeading < 292.5) && (heading.magneticHeading > 247.5)){
    		direction = "West"
    	}else if((heading.magneticHeading < 247.5) && (heading.magneticHeading > 202.5)){
    		direction =	"South West"
    	}else if((heading.magneticHeading < 202.5) && (heading.magneticHeading > 157.5)){
    		direction =	"South"
    	}else if((heading.magneticHeading < 157.5) && (heading.magneticHeading > 112.5)){
    		direction =	"South East"
    	}else if((heading.magneticHeading < 112.5) && (heading.magneticHeading > 67.5)){
    		direction =	"East"
    	}else if((heading.magneticHeading < 67.5) && (heading.magneticHeading > 22.5)){
    		direction =	"North East"
    	}
    	
        var element = document.getElementById('heading');
		element.innerHTML = direction
		$("#heading").css("text-align", "center");
		$("#nat").rotate(360 - (heading.magneticHeading));
    }

    function compError() {
        alert('onError!');
    }
    navigator.compass.watchHeading(compSuccess, compError, options);
});