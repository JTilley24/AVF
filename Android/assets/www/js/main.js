//Justin Tilley
//AVF 1303


$("#vinbtn").on("click", function(){
	$("#carresults").empty();
	var vin = $("#vinsearch").val();
	console.log(vin);
	var a = encodeURIComponent(vin);
	$.getJSON("http://api.edmunds.com/v1/api/toolsrepository/vindecoder?vin=" + a + 
		"&api_key=saw2xy7wdxjqfueuxkv5hm8w&fmt=json", 
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

