var app = new Vue({
    el: '#app',
    data: {
        map: {},
        service: {},
        placesList: [],
        markers: [],
        pyrmont: {
            lat: 50.128718762972554,
            lng: 30.65637230873108
        }
    },
    methods: {
        initMap: function () {
            this.map = new google.maps.Map(document.getElementById('map'), {
                center: this.pyrmont,
                zoom: 17
            });
            this.service = new google.maps.places.PlacesService(this.map);

            google.maps.event.addListener(this.map, 'click', function (event) {
                app.searchPlaces(event);
            });
        },
        searchPlaces: function (event) {
            let lat = event.latLng.lat();
            let lng = event.latLng.lng();
            this.service.nearbySearch({
                location: {
                    lat,
                    lng
                },
                radius: 500,
                type: ['cafe']
            }, this.processResults);
        },
        processResults: function (results, status, pagination) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
                return;
            } else {
                this.deleteAllMarkers();
                this.createMarkers(results);
            }
        },
        createMarkers: function (places) {
            this.placesList = []; // null
            console.log('placesList : ', this.placesList);

            var bounds = new google.maps.LatLngBounds();

            var placesListEl = document.getElementById('places');
            
            for (var i = 0, place; place = places[i]; i++) {
                var image = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                var marker = new google.maps.Marker({
                    map: this.map,
                    icon: image,
                    title: place.name,
                    position: place.geometry.location
                });
                let currnetPlace = {
                    position: place.geometry.location,
                    name: place.name
                }

                this.markers.push(marker);
                this.placesList.push(currnetPlace);

                // placesListEl.innerHTML += '<li>' + place.name + '</li>';

                bounds.extend(place.geometry.location);
            }
            this.map.fitBounds(bounds);
        },
        setMapOnAll: function (map) {
            for (var i = 0; i < this.markers.length; i++) {
                this.markers[i].setMap(map);
            }
        },
        clearMarkers: function () {
            this.setMapOnAll(null);
        },
        deleteAllMarkers: function () {
            this.clearMarkers();
            this.markers = [];
        },
        processCafe: function (place) {
            alert(place.name);
        }
    }
});