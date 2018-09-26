// Favourite Places Hard Coded data.
var FavouritePlaces = [
    {title: 'Sheikh zayed youth club', location: {lat: 30.041926, lng: 30.97621}},
    {title: ' Al Hosari Square', location: {lat: 29.972562, lng: 30.943892}},
    {title: 'Misr University For Science And Technology', location: {lat: 29.996383, lng: 30.9659}},
    {title: 'Top Fruit', location: {lat: 30.037077, lng: 31.011113}},
    {title: 'Americana plaza', location: {lat: 30.026847, lng: 31.013788}},
    {title: 'Arkan Mall', location: {lat: 30.020376, lng: 31.003584}},
    {title: 'Mall of Arabia', location: {lat: 30.006299, lng: 30.973481}}

];

// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
    // Create a styles array to use with the map.
    var styles = [
        {
            featureType: 'road.highway',
            elementType: 'labels.icon',
            stylers: [
                { visibility: 'off' }
            ]
        }
    ];

    var Infowindow = new google.maps.InfoWindow();

    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 30.049163, lng: 30.97616},
        zoom: 13,
        styles: styles
    });


    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < FavouritePlaces.length; i++) {
        // Get the position from the location array.
        var position = FavouritePlaces[i].location;
        var title = FavouritePlaces[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
        });

        // Push the marker to our array of markers.
        markers.push(marker);
        //display the markers
        marker.setMap(map);
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, Infowindow);
        });

        // Two event listeners - one for mouseover, one for mouseout,

        // to change the colors back and forth.
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
    }
}


// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        // In case the status is OK, which means the pano was found, compute the
        // position of the streetview image, then calculate the heading, then get a
        // panorama from that and set the options
        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="panorama"></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('panorama'), panoramaOptions);
            } else {
                infowindow.setContent('<div>' + marker.title + '</div>');
            }
        }
        // Use streetview service to get the closest streetview image within
        // 50 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21,34));
    return markerImage;
}

function GoogleMapError() {
    alert("there an error , map cannot be loaded");
}