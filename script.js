// Create map
var map = L.map("map").setView([30.3753, 69.3451], 5);


// ===============================
// BASEMAPS
// ===============================

// OpenStreetMap
var osm = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "© OpenStreetMap contributors"
    }
);


// Satellite
var satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
        attribution: "Tiles © Esri"
    }
);


// Show OSM first
osm.addTo(map);


// ===============================
// CITY LAYER
// ===============================

fetch("cities.geojson")
    .then(response => response.json())
    .then(data => {

        var citiesLayer = L.geoJSON(data, {

            pointToLayer: function(feature, latlng) {

                return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: "red",
                    color: "black",
                    weight: 1,
                    fillOpacity: 0.8
                });

            },

            onEachFeature: function(feature, layer) {

                layer.bindPopup(
                    "<b>City:</b> " + feature.properties.name +
                    "<br><b>Province:</b> " + feature.properties.province +
                    "<br><b>Type:</b> " + feature.properties.type
                );

            }

        }).addTo(map);


        // Save city layer
        window.citiesLayer = citiesLayer;

        addLayerControl();

    })
    .catch(error => console.log("City Error:", error));


// ===============================
// WEATHER STATION LAYER
// ===============================

fetch("weather_station.geojson")
    .then(response => response.json())
    .then(data => {

        var weatherLayer = L.geoJSON(data, {

            pointToLayer: function(feature, latlng) {

                return L.circleMarker(latlng, {
                    radius: 6,
                    fillColor: "blue",
                    color: "black",
                    weight: 1,
                    fillOpacity: 0.8
                });

            },

            onEachFeature: function(feature, layer) {

                layer.bindPopup(
                    "<b>Station:</b> " + feature.properties.station +
                    "<br><b>Temperature:</b> " + feature.properties.temperature + " °C" +
                    "<br><b>Rainfall:</b> " + feature.properties.rainfall + " mm"
                );

            }

        }).addTo(map);


        // Save weather layer
        window.weatherLayer = weatherLayer;

        addLayerControl();

    })
    .catch(error => console.log("Weather Error:", error));


// ===============================
// LAYER CONTROL
// ===============================

function addLayerControl() {

    if (window.citiesLayer && window.weatherLayer) {

        var baseMaps = {

            "OpenStreetMap": osm,
            "Satellite": satellite

        };


        var overlayMaps = {

            "Cities": window.citiesLayer,
            "Weather Stations": window.weatherLayer

        };


        L.control.layers(baseMaps, overlayMaps).addTo(map);

    }

}