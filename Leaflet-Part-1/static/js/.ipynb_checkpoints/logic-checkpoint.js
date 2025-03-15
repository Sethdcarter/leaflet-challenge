// Create the 'basemap' tile layer that will be the background of our map.
let basemap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// OPTIONAL: Step 2
// Create the 'street' tile layer as a second background of the map


// Create the map object with center and zoom options.
let map = L.map("map", {
    center: [37.5, -98.0], // Center on the U.S.
    zoom: 5
});

// Then add the 'basemap' tile layer to the map.
basemap.addTo(map);

// OPTIONAL: Step 2
// Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
// Add a control to the map that will allow the user to change which layers are visible.


// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
function styleInfo(feature) {
        return {
            radius: getRadius(feature.properties.mag),
            fillColor: getColor(feature.geometry.coordinates[2]), // Depth
            color: "#000",
            weight: 0.5,
            opacity: 1,
            fillOpacity: 0.8
        };
    }

  // This function determines the color of the marker based on the depth of the earthquake.
 function getColor(depth) {
        return depth > 90 ? "#ff3333" :
               depth > 70 ? "#ff6633" :
               depth > 50 ? "#ff9933" :
               depth > 30 ? "#ffcc33" :
               depth > 10 ? "#ffff33" :
                            "#ccff33"; 
    }

  // This function determines the radius of the earthquake marker based on its magnitude.
function getRadius(magnitude) {
        return magnitude ? magnitude * 4 : 1;
    }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                `<strong>Magnitude:</strong> ${feature.properties.mag}<br>
                 <strong>Depth:</strong> ${feature.geometry.coordinates[2]} km<br>
                 <strong>Location:</strong> ${feature.properties.place}`
            );
        }
  // OPTIONAL: Step 2
  // Add the data to the earthquake layer instead of directly to the map.
  }).addTo(map);

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    // Initialize depth intervals and colors for the legend
        let depths = [-10, 10, 30, 50, 70, 90];
        div.innerHTML = "<strong>Earthquake Depth (km)</strong><br>";

    // Loop through our depth intervals to generate a label with a colored square for each interval.
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            `<i style="background:${getColor(depths[i])}; width: 15px; height: 15px; display: inline-block;"></i> ` +
            `${depths[i]}${depths[i + 1] ? "&ndash;" + depths[i + 1] + " km" : "+ km"}<br>`;
    }
    return div;
};

  // Finally, add the legend to the map.
    legend.addTo(map);

  // OPTIONAL: Step 2
  // Make a request to get our Tectonic Plate geoJSON data.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
    // Save the geoJSON data, along with style information, to the tectonic_plates layer.


    // Then add the tectonic_plates layer to the map.

  });
});
