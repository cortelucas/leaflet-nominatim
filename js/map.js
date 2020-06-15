var target = document.getElementById('map');

document.addEventListener('DOMContentLoaded', function(e){ //executa o código somente após carregar o DOM
    var optionsMap = {
        center: [-21.511263, -51.434978],
        zoom: 15
    }

    // criação do mapa
    let map = new L.map(target, optionsMap);
    map.doubleClickZoom.disable();

    //adicionar uma camada de bloco do OpenStreetMap
    let basemap = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    }); basemap.addTo(map);
});