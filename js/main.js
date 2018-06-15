// declaring global variables
var openwindow,place,marker;
// request for JSON of foursquare data
var clientID = 'D54CX2SYHKPSEIYEFTR0L3TXUWXBNQZWQANTWPOIAY4FKZYD';
var clientSecret = 'RO0J1ML2QL05BH1CUKUW2DXPGL5X0V4MG5ZXDMXXUJHLUAAR';
// to get map ocation for our requriment
function map() {
    var bhimavaram = {
        lat: 16.5443199,
        lng: 81.5169033
    };
     place = new google.maps.Map(document.getElementById('googlemap'),
    {
        zoom:13,
        center: bhimavaram
    });
    openwindow = new google.maps.InfoWindow();
    edges = new google.maps.LatLngBounds();   
    ko.applyBindings(new Design());
}
//set the Bounce function
function setBounce(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
          marker.setAnimation(null);
      }, 1400);
    }
}
//this function is used to show the location
var showlocation = function(content) {
    var self = this;
    this.heading = content.heading;
    this.position = content.location;
    this.street = '',
    this.phone = '';
    this.city = '',
    this.visible = ko.observable(true);
// storing the position variable with location 
    var link = 'https://api.foursquare.com/v2/venues/search?ll=' + this.position.lat + ',' + this.position.lng + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20160118' + '&query=' + this.heading;
    $.getJSON(link).done(function(content) {
		var output = data.response.venues[0];
        self.street = output.location.formattedAddress[0] ||'No street found';
        self.phone = output.contact.formattedPhone[1] ||'No phone found';
        self.city = output.location.formattedAddress[2] ||'No city found';
    }).fail(function() {
        alert('Oops!!wrong handling with FourSquareAPI');
    });
    this.marker = new google.maps.Marker({
        heading: this.heading,
        position: this.position,
        animation: google.maps.Animation.DROP,
        icon: marker
    });    
    self.remove = ko.computed(function () {
        if(self.visible() === true) {
            self.marker.setMap(place);
            place.fitBounds(edges);
            edges.extend(self.marker.position);
        } else {
            self.marker.setMap(null);
        }
    });
    // show place selected from list
    this.show = function(location) {
        google.maps.event.trigger(self.marker, 'click');
    };
    this.marker.addListener('click', function() {
        infoAttract(this, self.street, self.phone, self.city, openwindow);
        setBounce(this);
        place.panTo(this.getPosition());
    });
    // show bounce effect when list is selected
    this.fall = function(place) {
		google.maps.event.trigger(self.marker, 'click');
	};
};
/* main design function*/
var Design = function() {
    var self = this;
    this.findplace = ko.observable('');
    this.some = ko.observableArray([]);
    // adding location for the selected
    places.forEach(function(location) {
        self.some.push( new showlocation(location) );
    });
    // places identified on map
    this.placelist = ko.computed(function() {
        var findfilter = self.findplace().toLowerCase();
        if (findfilter) {
            return ko.utils.arrayFilter(self.some(), function(location) {
                var str = location.heading.toLowerCase();
                var sink = str.includes(findfilter);
                location.visible(sink);
				return sink;
			});
        }
        self.some().forEach(function(location) {
            location.visible(true);
        });
        return self.some();
    }, self);
};
//places that we want to display
var places = [
    {
        heading: 'Railway Station', 
        location: {lat: 16.5442, lng:81.5375}, 
    },
    {
        heading: 'Famous Hotel', 
        location: {lat: 16.5442479, lng: 81.5149185}, 
    },
    {
        heading: 'Bus Station', 
        location: {lat: 16.5443195, lng: 81.5169033}, 
    },
    {
        heading: 'Famous Temple', 
        location: {lat: 16.5428, lng: 81.5234113},
    },
    {
        heading: 'Top College', 
        location: {lat: 16.5674794, lng: 81.5217052}, 
    },
];
// handle map error
function googleMapsError() {
    alert('OOPS!got an Error');
}
//this function make the openwindow when it is clicked
function infoAttract(marker, street, phone, city, openwindow) {
    if (openwindow.marker != marker) {
        openwindow.setContent('');
        openwindow.marker = marker;
        openwindow.addListener('closeclick', function() {
            openwindow.marker = null;
        });
        var streetview = new google.maps.StreetViewService();
        var radius = 30;
        var windowContent = '<h5>' + marker.heading + '</h5>' + 
            '<p>' + street + "</br>" + phone + '</br>' + city + "</p>";
        var getview= function (content, site) {
            if (site == google.maps.StreetViewStatus.OK) {
                var viewlocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    viewlocation, marker.position);
                openwindow.setContent(windowContent);
            } 
            else {
                openwindow.setContent(windowContent + '<div style="color:darkorchid">No Street View Found</div>');
            }
        };
        streetview.getPanoramaByLocation(marker.position, radius, getview);
        openwindow.open(place, marker);
    }
}
