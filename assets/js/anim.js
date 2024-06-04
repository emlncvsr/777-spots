// Écouteur d'événement pour la fermeture de la popup
map.on("popupclose", function (e) {
  $("#sidebar").removeClass("displayed");
  setTimeout(() => {
    // $(".leaflet-control-zoom").removeClass("swiped");
  }, 300);
});

// Gestionnaire d'événement pour le bouton croix de la popup
$("#popup-close-btn").click(function () {
  map.closePopup();
  $("#sidebar").removeClass("displayed");
  setTimeout(() => {
    // $(".leaflet-control-zoom").removeClass("swiped");
  }, 300);
});

// Gestionnaire d'événement pour le bouton croix de la sidebar
$("#sidebar-close-btn").click(function () {
  $("#sidebar").removeClass("displayed");
  setTimeout(() => {
    // $(".leaflet-control-zoom").removeClass("swiped");
  }, 300);
});

$(document).ready(function () {
  $(".googleMapsLink").on("click", function (event) {
    if (event.detail === 1) {
      var range = document.createRange();
      range.selectNode(this);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
  });
});
