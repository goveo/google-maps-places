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
                zoom: 17,
                mapTypeId: 'roadmap'
            });

            var input = document.getElementById('pac-input');
            var searchBox = new google.maps.places.SearchBox(input);
            this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            this.map.addListener('bounds_changed', function () {
                searchBox.setBounds(app.map.getBounds());
            });
            searchBox.addListener('places_changed', function () {
                var places = searchBox.getPlaces();
                app.changePlaces(places);
                console.log('place changed');
            });
        },
        changePlaces: function (places) {
            if (places.length == 0) {
                return;
            }
            app.deleteAllMarkers();
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function (place) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };
                let marker = new google.maps.Marker({
                    map: app.map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                });
                app.markers.push(marker);

                app.placesList.push({
                    position: place.geometry.location,
                    name: place.name
                });
                
                marker.addListener('click', function() {
                    app.map.setCenter(marker.getPosition());
                    alert('Modal window with ' + place.name);
                  });

                if (place.geometry.viewport) {
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            app.map.fitBounds(bounds);
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