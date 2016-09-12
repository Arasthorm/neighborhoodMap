var markers = [];
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

function getAddress(location){

    var address;

    geocoder.geocode({'location':location}, function(results,status){
        if (status == 'OK'){
            if(results[1]){
                address = results[1].formatted_address;
            }else{
                address = 'no results found';
            }
        } else {
            address = "not enable due to: "+status;
        }
    }

    return address;
}

function treatPlace(p) {

    var myAddress = p.place.split(',');
    var mySpecificAdd = myAddress[0].split(' ');
    var finalAdd = "";

    for (var j = 0; j < mySpecificAdd.length; j++) {
        if(mySpecificAdd[j] === "NSW" || mySpecificAdd[j] === "ACT"){
            break;
        }
        finalAdd += mySpecificAdd[j];
    }

    finalAdd = finalAdd.replace(/[0-9]/g,'');

    return finalAdd;
}

function addMarker(location,map){
    var address;
    var geocoder = new google.maps.Geocoder;
    var infoWindow = new google.maps.InfoWindow;
    var finalAdd = "";
    var wikipedia = [];
    var flickr = [];

    var marker = new google.maps.Marker({
        position: location,
        label: labels[labelIndex++ % labels.length],
        place: address,
        wiki: wikipedia,
        flickr: flickr
    });

    marker.place = getAddress(location);

    infoWindow.setContent(marker.place);
    finalAdd = treatPlace(marker);

    marker.wiki = getWikipedia(finalAdd);
    marker.flickr = getFlickr(finalAdd);

    markers.push(marker);

    marker.addListener('mouseover',function(){
        infoWindow.open(map,marker);
    });

    marker.addListener('mouseout',function(){
        infoWindow.close(map,marker);
    });

    marker.addListener('click',function(){
        for (var i = 0; i < markers.length; i++) {
            if (markers[i] === marker) {
                markers[i].setMap(null); //Removes the marker from the map
                markers.splice(i,1);
            }
        }

    });
}