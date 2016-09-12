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

        function searchMarker(){
            var searchVal = document.getElementById("searchValue").value;
            for (var i = 0; i < markers.length; i++) {
                if(markers[i].label === searchVal ||
                                markers[i].place === searchVal){

                    var finalADD = treatPlace(markers[i]);
                    console.log(finalADD);
                    displayWikipedia(finalADD);
                    displayFlickr(finalADD);
                }
            }
        }

        function displayFlickr(address){
            var $flickrElem = $('#Flickr-links');
            $flickrElem.text("");
            var flickr = new Flickr({
                api_key: "c97286d1897feed59cb562443dc35209"
            });

            flickr.photos.search({
                text: address
            }, function(err, result) {

                if(err) { throw new Error(err); }

                console.log(result);
                if (result.photos.photo.length != 0) {
                    console.log("after " + result.photos.photo.length);
                    var size = result.photos.photo.length > 3 ? 3 : result.photos.photo.length;
                    for (var i = 0; i < size; i++) {
                        var flick = result.photos.photo[i];
                        var url = "https://farm"+flick.farm + ".staticflickr.com/"+flick.server+"/"+flick.id+"_"+flick.secret+".jpg";
                        $flickrElem.append('<div imageURL="'+url+'" class="col-md-6 col-lg-4 picture-tile img-responsive" data-toggle="modal" data-target="#picture"><img class="imgSmall" src="'+url+'"></div>');
                    }
                }
            });
        }


        function displayWikipedia(address) {

            var $wikiElem = $('#wikipedia-links');
            $wikiElem.text("");
            var wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+address+"&format=json";

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
                    size = articleList.length>6 ? 6 : articleList.length;

                    console.log(articleList.length);
                    for(var i=0;i<size;i++){
                        articleStr = articleList[i];
                        var url='http://en.wikipedia.org/wiki/' + articleStr;
                        $wikiElem.append('<li><a class="link" href="'+url+'">' + articleStr + '</a></li>');
                    };
                clearTimeout(wikiRequestTimeout);
                }
            });
        }


        function addMarker(location){

            var address;
            var geocoder = new google.maps.Geocoder;
            var infoWindow = new google.maps.InfoWindow;
            var marker = new google.maps.Marker({
                position: location,
                label: labels[labelIndex++ % labels.length],
                place: address
            });

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
                displayWikipedia(treatPlace(marker));
                displayFlickr(treatPlace(marker));
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

         $(document).on('.hanging-close, .modal-backdrop, .modal', function (event) {
            // Remove the src so the player itself gets removed, as this is the only
            // reliable way to ensure the video stops playing in IE
            $("#picture-container").empty();
        });

         $(document).on('click', '.picture-tile', function (event) {
            console.log("cliked");
            var imageURL = $(this).attr('imageURL');
            $("#picture-container").empty().append('<img class="imgBig" src="'+imageURL+'"></div>');
        });




