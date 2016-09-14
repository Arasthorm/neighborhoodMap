function initMap() {

        var marker;

        myLatLng = {lat:-34.397, lng: 150.644};
        var myMap = document.getElementById('map');

        map = new google.maps.Map(myMap, {
            center: myLatLng,
            zoom: 10
        });

        map.addListener('click', function(event){
            console.log(event.latLng.lat());
            marker = addMarker(event.latLng,map);
        });
    }

function searchMarker(){

    var searchVal = document.getElementById("searchValue").value;
    for (var i = 0; i < markers.length; i++) {
        if(markers[i].label === searchVal ||
                    markers[i].place === searchVal){

            displayWikipedia(markers[i].wiki);
            displayFlickr(markers[i].flickr);
        }
    }
}

function displayWikipedia(wikiLinks){

    var $wikiElem = $('#wikipedia-links');
    $wikiElem.text("");

    var size = wikiLinks.length>6 ? 6 : wikiLinks.length;

    for(var i=0;i<size;i++){
        articleStr = wikiLinks[i];
        var url='http://en.wikipedia.org/wiki/' + articleStr;
        $wikiElem.append('<li><a class="link" href="'+url+'">' + articleStr + '</a></li>');
    };

}


function displayFlickr(flickrURLS){

    var $flickrElem = $('#Flickr-links');
    $flickrElem.text("");

    var size = flickrURLS.length > 3 ? 3 : flickrURLS.length;

    for (var i = 0; i < size; i++) {
        $flickrElem.append('<div imageURL="'+flickrURLS[i]+'" class="col-md-6 col-lg-4 picture-tile img-responsive" data-toggle="modal" data-target="#picture"><img class="imgSmall" src="'+flickrURLS[i]+'"></div>');
    }
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