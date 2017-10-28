///////////////////////////////// definições gerais do mapa

var map = L.map('leafletmap', {
    center: [41.6514332,-8.4503003],
    zoom: 12,
    minZoom:12,
    maxZoom:12,
    zoomControl: false
});


// var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
//     maxZoom: 20,
//     subdomains:['mt0','mt1','mt2','mt3']
// }).addTo(map);

// source: https://stackoverflow.com/questions/9394190/leaflet-map-api-with-google-satellite-layer


var Stamen_TonerLite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
  subdomains: 'abcd',
  ext: 'png'
}).addTo(map);

L.control.zoom({
     position:'bottomright'
}).addTo(map);


/////////////////////////////////fake layer



function style_fake_layer(feature) {
    return {
        fillColor:'#cccccc',
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
}

function fake_layer() {
  fillOpacity = .6;
$.getJSON("js/t0/distritos_portugal_fake_layer.geojson",function(hoodData){
  geojsonLayer = L.geoJson( hoodData  , {
    style: style_fake_layer}).addTo(map);
});
};

// fake_layer();




///////////////////////////////////// True layer


var input = 557;

//////// definições de cores 
function getColor(d) {
    return input*0.75 <= d ? '#421010' :
           input*0.5 <= d ? '#D8AA9C' :
           input*0.33 <= d ? '#E5C19F' :
           input*0 <= d ? '#ECDEA2' :
                      '#b7b7b7';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.preco),
        weight: 0.7,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.8
    };
}

var geojson;

function run_price() {
geojson = $.getJSON("js/t0/concelhos.geojson",function(hoodData){
  geojsonLayer = L.geoJson( hoodData  , {
    style: style, onEachFeature: onEachFeature}).addTo(map);
});
};

$(document).ready(function(){
  run_price();
});



///////////////////////////////// handler interactivo 

var salario_minimo = 557

$("#money_counter").html(salario_minimo + " €");


$("#variable_slider").slider({
     value: salario_minimo,
     orientation: "vertical",
     range: "min",
     min: 1,
     max: 2000,
     slide: function (event, ui) {
        input = $("#variable_slider").slider("value");
        if (input > 1900) {
          $("#money_counter").html("< 1900 €");
        } else if (input < 100){
          $("#money_counter").html("> 100 €");
        } else {
          $("#money_counter").html($.number(input) + " €");
        };
     },
      stop: function(event, ui) {
        var currentZoom = map.getZoom();
        if (currentZoom >= 9 && currentZoom < 11) {
          $(document).ready(function(){
            concelhos();
          });
        } else if (currentZoom <= 9) {
          $(document).ready(function(){
            run_price();
          });
        } else if (currentZoom >= 11) {
            $(document).ready(function(){
            freguesias();
          });
        }
    }
 });


//////// clener
function cleaner_map() {
  geojsonLayer.clearLayers();
};


//////////////////////// hover effect + zoom 

/// evento mouseover
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#a6a6a6',
        dashArray: '',
        fillOpacity: 0.7
    });

    info.update(layer.feature.properties);

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

/// evento mouseout

function resetHighlight(e) {
    geojsonLayer.resetStyle(e.target);
}


/// clicar para zoom

function zoomToFeature(e) {
    window.open("braga.html","_self")
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}


//// Div com info

var info = L.control();

function add_to_map() {
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed


  info.update = function (props) {
      this._div.innerHTML = '<h4>' +  (props ?
      props.name_2 + '</h4>'+ '<p class="area_metro">' + props.info_1 + '</p>' + '<hr><table class="table-sm"><tr><th>Preço Médio</th><td>' + props.preco +' €</td></tr><tr><th>Preço por m²</th><td>'+props.preco_m2+ ' €/m²</td></tr>' +'</table><hr><p>Para viver neste ' + props.tipo + ' teria que gastar,<br> por mês, <b>' + Math.round((props.preco/input)*100) + '% do seu rendimento</b>.<div class="'+props.tipo+props.name_2+'"></div></p><p><i>Dados calculados com base <br> em ' + props.n_casos + ' casos registados em Maio de 2017.'
      : '');
  };
}

add_to_map();

info.addTo(map);






// import new layer para concelhos

function concelhos() {
  fillOpacity = .6;
    geojson = $.getJSON("js/t0/concelhos.geojson",function(hoodData){
    geojsonLayer = L.geoJson( hoodData  , {
    style: style, onEachFeature: onEachFeature}).addTo(map);
});
};


// import fake layer para concelhos

function style_fake_layer_concelhos(feature) {
    return {
        fillColor:'#cccccc',
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity:0.8
    };
}


function concelhos_fake_layer() {
  fillOpacity = .6;
    geojson = $.getJSON("js/t0/concelhos_fake_layer.geojson",function(hoodData){
    geojsonLayer = L.geoJson( hoodData  , {
    style: style_fake_layer_concelhos}).addTo(map);
});
};


// import new layer para freguesias

function freguesias() {
  fillOpacity = .6;
    geojson = $.getJSON("js/t0/freguesias.geojson",function(hoodData){
    geojsonLayer = L.geoJson( hoodData  , {
    style: style, onEachFeature: onEachFeature}).addTo(map);
});
};

// import fake layer para freguesias



function zoom_based_layerchange() {
    console.log(map.getZoom());
    $("#zoomlevel").html(map.getZoom());
    var currentZoom = map.getZoom();
    switch (currentZoom) {
        case 14:
        case 13:
        case 12:
        case 11:
          cleaner_map();
          $(document).ready(function(){
            freguesias();
          });
          console.log("Hello freguesias")
            break; 
        case 10:
        case 9:
          cleaner_map();
          concelhos_fake_layer()
          $(document).ready(function(){
            concelhos();
          });
          console.log("Hello concelhos")
            break;        
        case 8:
        case 7:
          cleaner_map();
            $(document).ready(function(){
              run_price();
            });
            break;

        default:
            break;

    }
};


map.on('zoomend', function (e) {
    zoom_based_layerchange();
});

//// Botões de navegação automática:

document.getElementById('map-navigation').onclick = function(abc) {
        var pos = abc.target.getAttribute('data-position');
        var zoom = abc.target.getAttribute('data-zoom');
        if (pos && zoom) {
            var locat = pos.split(',');
            cleaner_map();
            concelhos();
            var zoo = parseInt(zoom);
            map.setView(locat, zoo, {animation: true});
            return false;
        }
    }       

/// botão activo 

$('#map-navigation a').on('click',function(){
  $('#map-navigation a').removeClass('active');
  $(this).addClass('active');
});


