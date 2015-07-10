var socket = io();
var map;


function initialize() {
	
	var mapOptions = {
		center: new google.maps.LatLng(50.0357622, 8.3318154),
		disableDefaultUI: true,
		zoom: 4
	};
	
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}


google.maps.event.addDomListener(window, 'load', initialize);

socket.on('tweet', function(tweet){

	var template = document.getElementById("tweet-template").textContent;
	var html = Mustache.render(template, tweet);	
	var bookmark_element = document.createElement("div");
    bookmark_element.innerHTML = html;
	document.getElementById("tweetFrame").insertBefore(bookmark_element, document.getElementById("tweetFrame").firstChild);
	
	//MAP
	var myLatlng = new google.maps.LatLng(tweet.latitude, tweet.longitude);
	var bookmark_element2 = document.createElement("div");
	bookmark_element2.innerHTML = html;
	var infowindow = new google.maps.InfoWindow({
		disableAutoPan: true,
		content: bookmark_element2/*tweet.body*/
	});
	var marker = new google.maps.Marker({
      position: myLatlng,
	  animation: google.maps.Animation.DROP,
	  icon: '../images/love.png',
      map: map,
      title: 'Hello World!'
    });
	//map.setCenter(myLatlng);
	infowindow.open(map, marker);
	google.maps.event.addListener(marker, "click", function() {
		infowindow.open(map,marker);
	});
	bookmark_element.addEventListener("mouseover", function() {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}, false);
	bookmark_element.addEventListener("mouseout", function() {
		marker.setAnimation(null);
	}, false);
	setTimeout(function(){ infowindow.close(); }, 5000);
});