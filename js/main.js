function ViewModel() {

    var self = this;
    this.Searchfilter = ko.observable("");

   this.markerBounce = function(marker) {
        populateInfoWindow(marker, new google.maps.InfoWindow());
         marker.setAnimation(google.maps.Animation.BOUNCE);
    };

    initMap();

    this.filterdLocation = ko.computed(function() {
        var searchResults = [];
        markers.forEach(function (marker) {
            if (marker.title.toLowerCase().includes(self.Searchfilter().toLowerCase())) {
                searchResults.push(marker);
                marker.setVisible(true);
            } else
                marker.setVisible(false);
        });
        return searchResults;
    }, this);
}

// function to initialize the app
function initialize() {
    ko.applyBindings(new ViewModel());
}