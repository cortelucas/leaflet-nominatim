var target = document.getElementById('map');

document.addEventListener('DOMContentLoaded', function (e) { //executa o código somente após carregar o DOM
    new Autosuggest('#search', {
        howManyCharacters: 2,
        delay: 500,
        howManyRecordsShow: 5,
        output: 'output-list',
        searchMethod: true,
        error: {
            placeholder: 'something went wrong...',
        },
        formatGeoJSON: true,
        dataAPI: {
            // nominatim
            searchLike: true,
            path: 'https://nominatim.openstreetmap.org/search?format=geojson&q=',

            // static files
            // searchLike: false,
            // path: '../static/search.json',
        },
        clearButton: true,
        specificOutput: function (matches) {
            const regex = new RegExp(matches[0], 'i');
            return matches.map((element, index) => {
                if (index > 0) {
                    const { geometry, properties } = element;
                    return `<li data-elements="${geometry.coordinates} | ${properties.display_name}">
                    <p>
                        ${properties.display_name.replace(regex, (str) => `<b>${str}</b>`)}
                    </p>
                    </li> `;
                }
            }).join('');
        }
    });

    var optionsMap = {
        center: [-21.511263, -51.434978],
        zoom: 15
    }

    // criação do mapa
    var map = new L.map(target, optionsMap);
    map.doubleClickZoom.disable();

    //adicionar uma camada de bloco do OpenStreetMap
    var basemap = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    }); basemap.addTo(map);

    var markers = [];
    function setNewMarkerAndRemoveOlder() {
        setTimeout(() => {
            var dataElements = document
                .querySelector('.search')
                .getAttribute('data-elements');
            var [coord, name] = dataElements.split('|');
            var [cordlat, cordlng] = coord.split(',');
            var corlat = +cordlat;
            var corlng = +cordlng;
            var marker = L.marker([cordlng, cordlat], {
                title: name,
            })
                .addTo(map)
                .bindPopup(name);

            markers.push(marker);
            map.setView([corlat, corlng], 8);

            if (markers.length > 1) {
                for (let i = 0; i < markers.length - 1; i++) {
                    map.removeLayer(markers[i]);
                };
            }
        }, 500);
    }

    //eventos
    function handleEvent(event) {
        event.stopPropagation();
        switch (event.type) {
            case 'click':
            case 'keyup': {
                setNewMarkerAndRemoveOlder();
                break;
            };
            default:
                break;
        };
    };

    // desencadeia eventos de clique ou keyup
    var coordinates = document.querySelector('.output-search');
    coordinates.addEventListener('click', handleEvent);
    document.addEventListener('keyup', function (e) {
        e.preventDefault();
        if (e.keyCode === 13) {
            handleEvent(e);
        }
    });
});