function getFlickr(address,marker){

    var urls = [];
    var $flickrElem = $('#Flickr-links');
    $flickrElem.text("");


    var flickr = new Flickr({
        api_key: "YOUR_FLICKR_API_KEY"
    });

    flickr.photos.search({
        text: address
    }, function(err, result) {

        if(err) { throw new Error(err); }
        size = result.photos.photo.length;

        if (size != 0) {

            console.log("after " + size);
            for (var i = 0; i < size; i++) {
                var flick = result.photos.photo[i];
                var url = "https://farm"+flick.farm + ".staticflickr.com/"+flick.server+"/"+flick.id+"_"+flick.secret+".jpg";
                urls.push(url);
            }
        }

    marker.flickr = urls;
    displayFlickr(urls);

    });
}


function getWikipedia(address,marker) {

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
            marker.wiki = result[1];
            displayWikipedia(result[1]);
            clearTimeout(wikiRequestTimeout);
        }
    });
}

