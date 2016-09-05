var map;

    function initMap() {

        var markers = [];
        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var labelIndex = 0;

        myLatLng = {lat:-34.397, lng: 150.644};
        var myMap = document.getElementById('map');

        map = new google.maps.Map(myMap, {
            center: myLatLng,
            zoom: 10
        });

        map.addListener('click', function(event){
            console.log(event.latLng.lat());
            addMarker(event.latLng);
        });

        function addMarker(location){

            var address;
            var geocoder = new google.maps.Geocoder;
            var marker = new google.maps.Marker({
                position: location,
                map: map,
                label: labels[labelIndex++ % labels.length],
                place: address
            });
            var infoWindow = new google.maps.InfoWindow;

            geocoder.geocode({'location':location}, function(results,status){
                if (status == 'OK'){
                    if(results[1]){
                        address = results[1].formatted_address;
                    } else{
                        address = 'no results found';
                    }
                } else {
                    address = "not enable due to: "+status;
                }
                marker.place = address;
                markers.push(marker);
                infoWindow.setContent(marker.place);
            });

            marker.addListener('mouseover',function(){
                infoWindow.open(map,marker);
            });
            marker.addListener('mouseout',function(){
                infoWindow.close(map,marker);
            });

            marker.addListener('click',function(){
                for (var i = 0; i < markers.length; i++) {
                    if (markers[i] === marker) {

                        markers[i].setMap(null);
                        markers.splice(i,1);
                    }
                }

            });
        }

}


