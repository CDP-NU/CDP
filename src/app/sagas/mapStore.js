import style from './mapLegend.scss'

const cartoAttribution = `Map tiles by
    <a href="https://cartodb.com/attributions#basemaps">CartoDB</a>, under
    <a target="_blank"
       href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>. Data by
    <a href="http://osm.org/copyright">OpenStreetMap</a>, under ODbL.`

const cartoUrl = 'http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'


class LeafletMap {

    constructor({geojsonLayer, legend}) {
	this.map = null
	this.geojsonLayer = geojsonLayer
	this.isMounted = false
	this.legend = legend
	this.isLegendMapped = false
    }

    didUnmount() {
	this.isMounted = false
	this.isLegendMapped = false
    }
    
    drawMap(node) {
	this.map = L.map(node, {
	    center: [41.881832, -87.623177],
	    zoom: 11
	})

	L.tileLayer(cartoUrl, {
	    attribution: cartoAttribution,
	    maxZoom: 16,
	    minZoom: 9
	}).addTo(this.map)

	this.legend.makeControl()
	this.isLegendMapped = false
    }

    removeGeojsonLayer() {
	const layer = this.geojsonLayer.geoLayer
	if(this.map.hasLayer(layer)) {
	    this.map.removeLayer(layer)
	}
	if(this.isLegendMapped) {
	    this.legend.removeFromMap(this.map)
	}
    }

    drawGeojson() {
	this.geojsonLayer.colorZones()
	this.geojsonLayer.geoLayer.addTo(this.map)
	this.legend.addTo(this.map)
	this.isLegendMapped = true
    }
}

class MapGeojsonLayer {

    constructor({cache}) {
	this.cache = cache
	this.geoLayer = null
	this._zoneKey = null
	this.zoneColors = []
    }

    useCurrentCacheGeojson() {

	const {json, level} = this.cache.getCurrent()

	this.geoLayer = L.geoJson(json)
	
	switch(level) {
	    case 'ward':
		this._zoneKey = 'ward'
		break
	    case 'precinct':
		this._zoneKey = 'wpid'
		break
	    default:
		this._zoneKey = null
	}
    }

    setZoneColorSource(zoneColors) {
	this.zoneColors = zoneColors
    }

    colorZones() {
	this.geoLayer.eachLayer( layer => {
	    const feature = layer.feature
	    const props = feature.properties
	    const propsZoneNum = props[this._zoneKey]
	    
	    
	    const zoneColor = this.zoneColors.find(
		({zone_num, color}) => 
		    zone_num == propsZoneNum 
	    )
	    const color = zoneColor ?
			  zoneColor.color : '#FFF'

	    const style = {
		fillColor: color,
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7
	    }
	
	    layer.setStyle(style)
	})
    }
}

class GeojsonCache {

    constructor() {
	this.year = null
	this.level = null
	this.geojsons = []
    }

    add({json, year, level}) {
	this.geojsons.push({
	    json, year, level
	})
    }

    select({year, level}) {
	this.year = year >= 2015 ?
		    2015 : 2003
	this.level = level
    }

    getCurrent() {
	return this.geojsons.length > 0 ?
	       this._getGeojson() : null
    }

    _getGeojson() {
	
	const geo = this.geojsons.find(
	    geojson => geojson.year === this.year &&
		     geojson.level === this.level
	)

	return geo ? geo : null
    }
}

class MapLegend {
    
    constructor() {
	this.control = null
	this.entries = []
    }

    setEntries(entries) {
	this.entries = entries
    }

    makeControl() {
	
	this.control = L.control({
	    position: 'bottomright'
	})

	this.control.onAdd = map => this._generateHtml()
    }
    
    addTo(map) {
	this.control.addTo(map)
    }

    removeFromMap(map) {
	map.removeControl(this.control)
    }

    _generateHtml() {
	const inner = this.entries.reduce(
	    (x, {color, value}) =>
		`${x}<i style="background:${color}"></i>${value}<br>`,
	    ''
	)

	const container = L.DomUtil.create(
	    'div', `${style.info} ${style.legend}`
	)
	container.innerHTML = inner
	return container
    }
}

export default () => {
    const legend = new MapLegend()
    const cache = new GeojsonCache()
    const geojsonLayer = new MapGeojsonLayer({cache})
    const map = new LeafletMap({geojsonLayer, legend})
    return {
	map,
	geojsonLayer,
	cache,
	legend
    }
}
