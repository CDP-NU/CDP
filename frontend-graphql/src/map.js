import L from 'leaflet'

const cartoAttribution = `Map tiles by
    <a href="https://cartodb.com/attributions#basemaps">CartoDB</a>, under
    <a target="_blank"
       href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>. Data by
    <a href="http://osm.org/copyright">OpenStreetMap</a>, under ODbL.`

const cartoUrl = 'http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'

class Map {

    map 
    geojsonLayer 
    legend 

    loadMap(node) {
	this.map = L.map(node, {
	    center: [41.881832, -87.623177],
	    zoom: 11,
	    zoomControl: false
	})

	L.control.zoom({
	    position: 'topright'
	}).addTo(this.map)

	L.tileLayer(cartoUrl, {
	    attribution: cartoAttribution,
	    maxZoom: 16,
	    minZoom: 9
	}).addTo(this.map)

	this.map.on('popupopen', e => {
	    
	    const loc = this.map.project(
		e.popup._latlng
	    )
	    
	    loc.y -= e.popup._container.clientHeight / 2
	    
	    this.map.panTo(
		this.map.unproject(loc), {
		    animate: true
		}
	    )
	})
    }

    addGeojson({geojson, colors, zoneKey, onClick = () => {}}) {
	
	this.geojsonLayer = L.geoJson(geojson, {
	    onEachFeature: (feature, layer) => {
		layer.on({
		    click: e => {
			
			const {latlng} = e
			
			const {
			    [zoneKey]: zone
			} = layer.feature.properties

			onClick(latlng, zone)
		    }
		})
	    }
	})

	this.geojsonLayer.eachLayer( layer => {
	    
	    const {
		[zoneKey]: layerZone
	    } = layer.feature.properties

	    const color = colors[parseInt(layerZone, 10)]
	    
	    const style = {
		fillColor: color ? color : '#FFF',
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7
	    }
	    
	    layer.setStyle(style)
	})

	this.geojsonLayer.addTo(this.map)
    }

    addLegend(entities) {

	this.legend = L.control({
	    position: 'bottomright'
	})

	this.legend.onAdd = map => {
	    const inner = entities.reduce(
		(x, {color, value}) =>
		    `${x}<i style="background:${color}"></i>${value}<br>`,
		''
	    )

	    const container = L.DomUtil.create(
		'div', 'info legend'
	    )

	    container.innerHTML = inner
	    return container
	}

	this.legend.addTo(this.map)
    }

    
    removeGeojson() {
	this.map.removeLayer(this.geojsonLayer)
    }

    removeLegend() {
	this.map.removeControl(this.legend)
    }

    closePopup() {
	this.map.closePopup()
    }

    openPopup({latlng, html}) {

	L.popup()
	 .setLatLng(latlng)
	 .setContent(html)
	 .openOn(this.map)
    }
}

export default () => new Map()
