var map;
var placesList = [];
var markers = [];

function initMap() {
    var pyrmont = {
        lat: 50.128718762972554,
        lng: 30.65637230873108
    };

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 17
    });

    var service = new google.maps.places.PlacesService(map);

    google.maps.event.addListener(map, 'click', function (event) {
        let lat = event.latLng.lat();
        let lng = event.latLng.lng();

        console.log(lat);
        console.log(lng);

        service.nearbySearch({
            location: {
                lat,
                lng
            },
            radius: 500,
            type: ['cafe']
        }, processResults);
    });
}

function processResults(results, status, pagination) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
    } else {
        deleteAllMarkers();
        createMarkers(results);

        if (pagination.hasNextPage) {
            var moreButton = document.getElementById('more');

            moreButton.disabled = false;

            moreButton.addEventListener('click', function () {
                moreButton.disabled = true;
                pagination.nextPage();
            });
        }
    }
}

function createMarkers(places) {
    console.log('createMarkers');
    console.log('markers : ', markers);   
    console.log('placesList : ', placesList);    
     
    var bounds = new google.maps.LatLngBounds();

    var placesListEl = document.getElementById('places');
    placesListEl.innerHTML = '';

    for (var i = 0, place; place = places[i]; i++) {
        var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };

        var marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            position: place.geometry.location
        });
        markers.push(marker);

        let currnetPlace = {
            position: place.geometry.location,
            name: place.name
        }
        placesList.push(currnetPlace);

        // placesListEl.innerHTML += '<li class="list-item" param_id="' + i + '">' + place.name + '</li>';

        bounds.extend(place.geometry.location);
    }
    for (var i = 0; i < placesList.length; i++) {
    placesListEl.innerHTML += '<li class="list-item" param_id="' + i + '">' + placesList[i].name + '</li>';
    }
    map.fitBounds(bounds);
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function clearMarkers() {
    setMapOnAll(null);
}

function deleteAllMarkers() {
    clearMarkers();
    markers = [];
}

$("#places").on("click", ".list-item", function(event){
    let id = $(this).attr('param_id');
    let currentPlace = placesList[id];
    // console.log(currentPlace.position.lat());
    console.log(currentPlace);
    alert(currentPlace.name, currentPlace.position.lat(), currentPlace.position.lng());
});