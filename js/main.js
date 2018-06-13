var some=[];
var openwindow,place;
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
            position: places[i].location,
            content: places[i].image,
            animation: google.maps.Animation.DROP,
        });
        some.push(marker);
        marker.addListener('click',function(){
            infoAttract(this,openwindow);
        });
    }
    showlocation();
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
// when selecting the place this function gives the datails of our window
function windows(marker){    
    var content = '<div class="contentset"> <h2>This Place is ' + marker.heading + ' in Bhimavaram.</h2></div><div class="content"><center><img src="'+ marker.content + '"></center></div>';
        openwindow.setContent(content);
        showlocation();
        
    }
// function is used to make the marker to bounce
function setBounce(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 652);
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
        image: 'http://mw2.google.com/mw-panoramio/photos/medium/66831435.jpg'
    },
    {
        heading: 'Famous Hotel', 
        location: {lat: 16.5442479, lng: 81.5149185}, 
        image: 'https://content3.jdmagicbox.com/comp/bhimavaram/s9/9999p8816.8816.100906220425.q9s9/catalogue/hotel-sri-abhiruchi-a-c-bhimavaram-ho-bhimavaram-home-delivery-restaurants-1405jir.jpg'
    },
    {
        heading: 'Bus Station', 
        location: {lat: 16.5443195, lng: 81.5169033}, 
        image : 'http://static.panoramio.com/photos/large/25510716.jpg'
    },
    {
        heading: 'Famous Temple', 
        location: {lat: 16.5428, lng: 81.5234113},
        image : 'https://templesinindiainfo.com/wp-content/uploads/2016/12/Sri-Mavullamma-Ammavaru-Temple-Bhimavaram.jpg'
    },
    {
        heading: 'Top College', 
        location: {lat: 16.5674794, lng: 81.5217052}, 
        image : 'http://www.icbse.com/colleges/media/clgimg/1-3592461.jpg'
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
