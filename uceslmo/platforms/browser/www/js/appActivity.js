// script holding functions to load the map and perform location tracking

//create client var
var client;


// code to add custom markers
var testMarkerRed = L.AwesomeMarkers.icon({
	icon: 'play',
	markerColor: 'red'
});
var testMarkerPink = L.AwesomeMarkers.icon({
	icon: 'play',
	markerColor: 'pink'
});

//set up mymap as a global variable outside of loadmap function
var mymap;

// to run when the App starts
loadMap()


// load map function
function loadMap() {
		// load the map
	mymap = L.map('mapid').setView([51.505, -0.09], 13);

	// load the tiles

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets'

	}).addTo(mymap);
	
	// add a point
	//L.marker([51.5, -0.09]).addTo(mymap)

}


// track location script modified showPosition
function trackLocation(){
	if(navigator.geolocation) {
	navigator.geolocation.watchPosition(showPosition);
	}else{
	//document.getElementById('mapid').innerHTML="Geolocation is not supported by this browser.";
	alert("Geolocation is not supported by this browser.");
	}
}

// display the position of the user with a popup and add to the map
function showPosition(position){
	var lat = position.coords.latitude
	var lng = position.coords.longitude
	
	L.marker(latlng, {icon:testMarkerPink}).addTo(mymap)
		.bindPopup("<b>Your position was "+ position.coords.longitude + " "+position.coords.latitude+"!</b>");
	mymap.setView([lat, lng], 13);		
}
//document.getElementById('mapid').innerHTML="L.marker(latlng, {icon:testMarkerPink}).addTo(mymap).bindPopup("<b>"position.coords"</b>");"


// and a variable that will hold the layer itself – we need to do this outside the function so that we can use it to remove the layer later on
var earthquakelayer;

// create the code to get the Earthquakes data using an XMLHttpRequest
function getEarthquakes() {
	client = new XMLHttpRequest();

client.open('GET','https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson');
	client.onreadystatechange = earthquakeResponse; // note don't use earthquakeResponse() with brackets as that doesn't work
	client.send();
}
// create the code to wait for the response from the data server, and process the response once it is received
function earthquakeResponse() {
	// this function listens out for the server to say that the data is ready - i.e. has state 4
	if (client.readyState == 4) {
		// once the data is ready, process the data
		var earthquakedata = client.responseText;
		loadEarthquakelayer(earthquakedata);
		}
}
// convert the received data - which is text - to JSON format and add it to the map
function loadEarthquakelayer(earthquakedata) {
	// convert the text received from the server to JSON
	var earthquakejson = JSON.parse(earthquakedata);


	// load the geoJSON layer
	var earthquakelayer = L.geoJson(earthquakejson,
		{
			// use point to layer to create the points
			pointToLayer: function (feature, latlng)
			{
				// look at the GeoJSON file - specifically at the properties - to see the earthquake magnitude and use a different marker depending on this value
				// also include a pop-up that shows the place value of the earthquakes
				if (feature.properties.mag > 1.75) {
					return L.marker(latlng, {icon:testMarkerRed}).bindPopup("<b>"+feature.properties.place +"</b>");
				}
				else {
					// magnitude is 1.75 or less
					return L.marker(latlng, {icon:testMarkerPink}).bindPopup("<b>"+feature.properties.place +"</b>");;
				}
			},
		}).addTo(mymap);
	mymap.fitBounds(earthquakelayer.getBounds());
}






// function to change a div's content to another html using AJAX
var xhr; // define the global variable to process the AJAX request
function callDivChange(){
	xhr = new XMLHttpRequest();
	// put a http url here instead of a specific html file
	xhr.open('GET', 'http://developer.cege.ucl.ac.uk:30267/test1.html', true);
	xhr.onreadystatechange = processDivChange;
	try{
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	}
	catch (e){
		// this only works in internet explorer
	}
	xhr.send();
}

function processDivChange(){
	if (xhr.readyState < 4) // while waiting response from server
		document.getElementById('ajaxtest').innerHTML = "Loading...";
		
	else if (xhr.readyState == 4){ // 4 is response from server has been completely loaded
		if (xhr.status == 200 && xhr.status < 300)
			// http status between 200 to 299 are all successful
			document.getElementById('ajaxtest').innerHTML = xhr.responseText;
			loadMap();
	}
}