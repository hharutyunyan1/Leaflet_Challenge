var earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function markerSize(magnitude) {
    return magnitude *6;
};

var earthquake = new L.LayerGroup();

d3.json(earthquake_url, function (geoJson) {
    L.geoJSON(geoJson.features, {
    pointToLayer: function (geoJsonPoint, latlng) {
    return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag)});
    },
    style: function (geoJsonFeature) {
    return {
    fillColor: Color(geoJsonFeature.properties.mag),
    fillOpacity: 0.8,
    weight: 0.2,
    color: 'red'
    }
},

    onEachFeature: function (feature, layer) {
    layer.bindPopup(
    "<h3 style='text-align:center;'>" + new Date(feature.properties.time) +
    "</h3> <hr> <h4 style='text-align:center;'>" + feature.properties.title + "</h4>");
    }
    }).addTo(earthquake);
    createMap(earthquake);
});


d3.json(function (geoJson) {
    L.geoJSON(geoJson.features, {
    style: function (geoJsonFeature) {
    return {weight: 3}
        },
    })
});

function Color(magnitude) {

    if (magnitude >= 5) {
        return '#d63447'
    } 
    else if (magnitude >= 4) {
        return '#dd7631'
    } 
    else if (magnitude >= 3) {
        return '#f57b51'
    } 
    else if (magnitude >= 2) {
        return '#ffd31d'
    } 
    else if (magnitude >= 1) {
        return '#fff591'
    } 
    else {
        return '#649d66'
    }
};

function createMap() {
    var grayscale = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 10,
        id: 'mapbox.light',
        accessToken: API_KEY
    });
    var outdoors = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 10,
        id: 'mapbox.outdoors',
        accessToken: API_KEY
    });
    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 10,
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });
    var baseLayers = {
        "Satellite": satellite,
        "Gray Scale": grayscale,
        "Outdoors": outdoors,
    };
    var overLayers = {
        "Earthquakes": earthquake,   
    };
    var mymap = L.map('map', {
        center: [34.0522, -118.2437],
        zoom: 5,
        layers: [satellite, earthquake]
    });

    L.control.layers(baseLayers, overLayers).addTo(mymap);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
            grades = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
            labels = ["#649d66",
                        "#fff591",
                            "#ffd31d",
                                "#f57b51",
                                    "#dd7631",
                                        "#d63447"];
            
        div.innerHTML += "<h4 style='margin:4px'>Magnitude:</h4>"

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<p style="margin-left: 15px">' + '<i style="background:' + labels[i] + ' "></i>' + '&nbsp;&nbsp;' + grades[i]+ '<\p>';
        }

        return div;
};
legend.addTo(mymap);
};