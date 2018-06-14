var some=[];
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
    openwindow=new google.maps.InfoWindow();
    for (var i = 0; i < places.length; i++){
        var marker = new google.maps.Marker({
            heading: places[i].heading,
            content: places[i].image,
            position: places[i].location,
            animation: google.maps.Animation.DROP,
        });
        some.push(marker);
        marker.addListener('click',function(){
            infoAttract(this,openwindow);
        });
        }
    showlocation();
}
function bgChange(bg) {
    document.marker.style.background=bg;
}

//show the location
function showlocation(){
    var edges = new google.maps.LatLngBounds();
    for (var i = 0; i < some.length; i++){
        some[i].setMap(place);
        edges.extend(some[i].position);
    }
    place.fitBounds(edges);
}
//this function is used to hide the location
function findLocation(value){
    if (openwindow.marker != value.location) {
        for (var i= 0; i < some.length; i++) {
            if (some[i].heading == value.heading) {
                infoAttract(some[i], openwindow);
                break;
            }
        }
    }
}
function four(){
    var reqURL = 'https://foursquare.com/developers/app' + marker.location.lat + ',' + marker.location.lng + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20160118'  + '&query=' + marker.heading;
    $.getJSON(reqURL).done(function(data) {
		var results = data.response.app[0];
        marker.street = results.location.formattedAddress[0] ? results.location.formattedAddress[0]: 'N/A';
        marker.city = results.location.formattedAddress[1] ? results.location.formattedAddress[1]: 'N/A';
        marker.phone = results.contact.formattedPhone ? results.contact.formattedPhone : 'N/A';
        marker.htmlfoursquare =
                    '<h5 class="iw_subtitle">(' + marker.category +
                    ')</h5>' + '<div>' +
                    '<h6 class="iw_address_title"> Address: </h6>' +
                    '<p class="iw_address">' + marker.street + '</p>' +
                    '<p class="iw_address">' + marker.city + '</p>' +
                    '<p class="iw_address">' + marker.zip + '</p>' +
                    '<p class="iw_address">' + marker.country +
                    '</p>' + '</div>' + '</div>';

                openwindow.setContent(marker.htmlContent + marker.htmlfoursquare);
    }).fail(function() {
        alert('Something went wrong with foursquare');
    });
}
// when selecting the place this function gives the datails of our window
function windows(marker){    
    var content = '<div class="contentset"> <h3>This Place is ' + marker.heading + ' in Bhimavaram.</h3></div><div class="content"><h4>'+ marker.content + '</h4></div>';
        openwindow.setContent(content);
        showlocation();    
    }       
// function is used to make the marker to bounce
function setBounce(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
          marker.setAnimation(null);
      }, 700);
    }
  }
  var seepage = {
    //search for query
    inputValue: ko.observable(''),
    list: ko.observableArray([]),
    displayList: ko.observable(true),
    displayError: ko.observable(false),
    error: ko.observable(''),
    initialize: function(condition){for(var j in places){
            seepage.list.push(places[j]);
        }
    },
    search: function(condition) {
        seepage.list.removeAll();
        for (var i = 0; i < some.length; i++) {
            some[i].setVisible(false);
        }
        for(var j in places) {{
            if(places[j].heading.toLowerCase().indexOf(condition.toLowerCase()) >= 0) {
              seepage.list.push(places[j]);
              var marker = places[j].location;
                for (var i = 0; i< some.length; i++) {
                    p=some[i].position.lat().toFixed(5);
                    q=marker.lat.toFixed(5);
                    r=some[i].position.lng().toFixed(5);
                    s=marker.lng.toFixed(5);
                    if (p == q &&
                        r == s ){
                            some[i].setVisible(true);
                    }
                }
            }
        }
    }
}
};
//gives the locations for our requirement
var places = [
    {
        heading: 'Railway Station', 
        location: {lat: 16.5442, lng:81.5375}, 
        image: 'street:Housing Board colony,1-72/A'
                        
    },
    {
        heading: 'Famous Hotel', 
        location: {lat: 16.5442479, lng: 81.5149185}, 
        image: 'street:Juvalapallem Road'
    },
    {
        heading: 'Bus Station', 
        location: {lat: 16.5443195, lng: 81.5169033}, 
        image : 'street:Menty Vari thota,phone:N/A'
    },
    {
        heading: 'Famous Temple', 
        location: {lat: 16.5428, lng: 81.5234113},
        image : 'street:Gunupudi'
    },
    {
        heading: 'Top College', 
        location: {lat: 16.5674794, lng: 81.5217052}, 
        image : 'street:vishnupur,phone:N/A'
    }
    ];
    seepage.initialize();
    seepage.inputValue.subscribe(seepage.search);
    ko.applyBindings(seepage);
    function infoAttract(marker, openwindow){
        setBounce(marker);
        if(openwindow.marker != marker){
            openwindow.marker = marker;
            openwindow.setContent('');
            windows(marker);
            openwindow.open(place,marker);
            openwindow.addListener('closeclick', function(){
                openwindow.marker = null;
            });
        }
    }
function googleMapsError() {
    alert('OOPS!got an Error');
}
