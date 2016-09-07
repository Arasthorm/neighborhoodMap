var map;
var markers = [];
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

    function initMap() {

        var searchButton = document.getElementById("getMarker");

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

    }

        function searchMarker(){
            var searchVal = document.getElementById("searchValue").value;
            for (var i = 0; i < markers.length; i++) {
                if(markers[i].label === searchVal ||
                                markers[i].place === searchVal){
                    console.log(markers[i].place);
                    displayWikipedia(markers[i].place);
                }
            }
        }


        function displayWikipedia(address) {

            var myAddress = address.split(' ');
            var finalAdd = "";
            for (var j = 0; j < myAddress.length; j++) {
                if(myAddress[j] === "NSW"){
                    break;
                }
                finalAdd += myAddress[j];
            }


            var $wikiElem = $('#wikipedia-links');
            $wikiElem.text("");
            var wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+finalAdd+"&format=json";

            var wikiRequestTimeout = setTimeout(function(){
                $wikiElem.text("failed to get wikipedia resources");
            },8000);

            $.ajax({
                url:wikiURL,
                dataType:'jsonp',
                success: function(result) {
                    // Handle or verify the server response if necessary.
                    var articleList = result[1];
                    var size = 0;
                    if (articleList.length>5) {
                        size=5
                    }else{
                        size=articleList.length;
                    }
                    console.log(articleList.length);
                    for(var i=0;i<size;i++){
                        articleStr = articleList[i];
                        var url='http://en.wikipedia.org/wiki/' + articleStr;
                        $wikiElem.append('<li><a href="'+url+'">' + articleStr + '</a></li>');
                    };
                clearTimeout(wikiRequestTimeout);
                }
            });
        }


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

                        markers[i].setMap(null); //Removes the marker from the map
                        markers.splice(i,1);
                    }
                }

            });
        }




