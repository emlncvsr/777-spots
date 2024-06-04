var map = L.map("map", {
  center: [37, 138],
  zoom: 5,
  zoomAnimation: true,
  fadeAnimation: true,
  markerZoomAnimation: true,
  zoomAnimationThreshold: true,
  animate: true,
  renderer: L.canvas(),
});

// Layers

//osm layer
// var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// });
// map.addLayer(osm)

var dark = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: "abcd",
  maxZoom: 20,
});

googleStreets = L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
  maxZoom: 20,
  subdomains: ["mt0", "mt1", "mt2", "mt3"],
});

googleSat = L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
  maxZoom: 20,
  subdomains: ["mt0", "mt1", "mt2", "mt3"],
});

googleStreets.addTo(map);

// var wms = L.tileLayer.wms("http://localhost:8080/geoserver/wms", {
//   layers: "geoapp:admin",
//   format: "image/png",
//   transparent: true,
//   attribution: "wms test",
// });

// Marker Cluster Group

var markers = L.markerClusterGroup({
  disableClusteringAtZoom: 8,
  spiderfyOnMaxZoom: false,
  showCoverageOnHover: false,
  iconCreateFunction: function (cluster) {
    var count = cluster.getChildCount();
    var size = count < 100 ? "small" : count < 1000 ? "medium" : "large";
    var color = count < 10 ? "green" : count < 100 ? "yellow" : count < 1000 ? "orange" : "red";
    return L.divIcon({
      html: "<div numberColor=" + color + ' class="circle-marker">' + count + "</div>",
      className: "cluster-icon-" + size,
      iconSize: [30, 30],
    });
  },
});

var tooltipsLayer = L.layerGroup();

var globalData;

fetch("https://script.google.com/macros/s/AKfycbzRqRi_s1oWswewaOgwCEiH6izX5y-3yCARwe1BZIqfmX5qC6VA_vpDchgYjF95FgdgIQ/exec")
  .then((response) => {
    if (!response.ok) {
      throw new Error("La requête a échoué avec le statut " + response.status);
    }
    return response.json();
  })
  .then((data) => {
    globalData = data;
    data.forEach((line, index) => {
      var latitude = parseFloat(line["Latitude"]);
      var longitude = parseFloat(line["Longitude"]);
      var title = line["Title"];
      if (!isNaN(latitude) && !isNaN(longitude)) {
        var iconUrl = "";
        var type = line["Type"];
        if (type === "Photo Spot") {
          iconUrl = "assets/img/togo.png";
        } else if (type === "Hall of Fame") {
          iconUrl = "assets/img/star.png";
        }
        var customIcon = L.icon({
          iconUrl: iconUrl,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });
        var marker = L.marker([latitude, longitude], { id: index, icon: customIcon });
        markers.addLayer(marker);
      }
    });

    map.addLayer(markers);
    map.addLayer(tooltipsLayer);
    updateTooltips(); // Active les tooltips par défaut
  })
  .catch((error) => {
    console.error("Erreur lors de la récupération des données :", error);
  });

function updateTooltips() {
  if (!globalData) return;

  if (map.hasLayer(tooltipsLayer)) {
    markers.eachLayer(function (layer) {
      if (!layer.getTooltip()) {
        var title = globalData[layer.options.id]["Title"];
        layer.bindTooltip(title, { permanent: false, direction: "right", offset: [20, 0] });
      }
    });
  } else {
    markers.eachLayer(function (layer) {
      if (layer.getTooltip()) {
        layer.unbindTooltip();
      }
    });
  }
}

tooltipsLayer.on("add", updateTooltips);
tooltipsLayer.on("remove", updateTooltips);

// Controls
var baseMaps = {
  "Google Street": googleStreets,
  Dark: dark,
  "Google Satellite": googleSat,
  // OSM: osm,
};

var overlayMaps = {
  Markers: markers,
  Tooltips: tooltipsLayer,
  // wms: wms,
};

L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);

map.on("moveend", function () {
  markers.refreshClusters();
});

markers.on("click", function (event) {
  var layer = event.layer;
  var id = layer.options.id;
  var properties = findPropertiesByIndex(id, globalData);
  updateSidebar(properties);
  $("#sidebar").addClass("displayed");
  // $(".leaflet-control-zoom").addClass("swiped");
});

function findPropertiesByIndex(index, data) {
  return data && data[index] ? data[index] : null;
}

function updateSidebar(properties) {
  if (properties) {
    $(".labelType").text(properties["Type"]);
    $(".title").text(properties["Title"]);
    $(".note").text(properties["Note"]);
    $(".googleMapsLink").text(properties["Link"]);
    $(".prefecture").text(properties["Préfecture"]) + " Prefecture";
    $(".id").text("#" + (globalData.indexOf(properties) + 2));
    $(".latitude").text(properties["Latitude"]);
    $(".longitude").text(properties["Longitude"]);
    if (!properties["Image"].includes("https://")) {
      $(".sidebarimg").removeClass("cover").addClass("unavailable");
    } else {
      $(".sidebarimg").addClass("cover").removeClass("unavailable");
    }
    $(".sidebarimg").css("background-image", "url(" + properties["Image"] + ")");
  } else {
    console.error("Propriétés non valides.");
  }
}

// Events

// map.on("mouseover", function () {
//   console.log("your mouse is over the map");
// });

// map.on("mousemove", function (e) {
//   document.getElementsByClassName("coordinate")[0].innerHTML = "lat: " + e.latlng.lat + "lng: " + e.latlng.lng;
// console.log("lat: " + e.latlng.lat, "lng: " + e.latlng.lng);
// });
