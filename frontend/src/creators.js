import * as actions from './actions.js'
import R from 'ramda'
import normalize, { aggregateMap, candidateMap } from './schema'
import {
    generateMapId,
    generateGeojsonID
} from './utility'

const isMobile = () => window
    .matchMedia("(max-width: 690px)")
    .matches

const extractGeoYear = raceUri => {   
    const raceYear = parseInt(R.take(4, raceUri), 10)
    return raceYear >= 2015 ? 2015 : 2003
}

const getGeojsonID = (raceUri, level) => generateGeojsonID(
    extractGeoYear(raceUri), level
)



export const autocomplete = keyword => ({
    type: actions.AUTOCOMPLETE,
    data: { keyword }
})
export const clearAutocompletions = () => ({
    type: actions.CLEAR_AUTOCOMPLETIONS,
    data: {}
})

export const searchDatabase = ({
    keyword,
    dateRange: [startDate, endDate],
    elections,
    offices
}) => ({
    type: actions.SEARCH_DATABASE,
    data: {
	keyword,
	startDate,
	endDate,
	elections,
	offices
    }	
})

const selectRaceMap = ({raceUri, level, id, geojson, geoYear}) => ({
    type: actions.SELECT_RACE_MAP,
    data: {
	id,
	isMobile: isMobile(),
	raceUri,
	level,
	geojson,
	geoYear
    }
})
const selectCandidateMap = ({raceUri, level, name: candidate, id, geojson, geoYear}) => ({
    type: actions.SELECT_CANDIDATE_MAP,
    data: {
	id,
	isMobile: isMobile(),
	raceUri,
	candidate: parseInt(candidate, 10),
	level,
	geojson,
	geoYear
    }
})

export const selectMap = R.compose(
    R.ifElse(
	R.propEq('name', 'aggregate'),
	selectRaceMap,
	selectCandidateMap
    ),
    map => {
	const geoYear = extractGeoYear(map.raceUri)
	return {
	    ...map,
	    id: generateMapId(map),
	    geoYear,
	    geojson: generateGeojsonID(geoYear, map.level)
	}
    }
)

export const selectGraph = ({raceUri}) => ({
    type: actions.SELECT_GRAPH,
    data: {
	id: generateMapId({raceUri}),
	raceUri,
	level: 'ward',
	geojson: generateGeojsonID(
	    extractGeoYear(raceUri), 'ward'
	)
    }
})

export const removeHeatMap = () => ({
    type: actions.REMOVE_HEAT_MAP
})



export const selectZone = ({race, level, zone, latlng}) => ({
    type: actions.SELECT_ZONE,
    data: {race, level, zone, latlng}
})
export const geocode = street => ({
    type: actions.GEOCODE,
    data: {street}
})



export const fetchedAutocompletions = ({autocompletions})  => ({
    type: actions.UPDATE_AUTOCOMPLETIONS,
    entities: {autocompletions}
})
export const fetchedSearchResults = searchResults => ({
    type: actions.UPDATE_SEARCH_RESULTS,
    entities: {
	searchResults: {
	    timestamp: Date.now(),
	    items: searchResults
	}
    }
})



export const fetchedRaceMap = R.compose(
    R.merge({type: actions.UPDATE_HEAT_MAP}),
    normalize(aggregateMap)
)

export const fetchedCandidateMap = R.compose(
    R.merge({type: actions.UPDATE_HEAT_MAP}),
    normalize(candidateMap)
)

export const fetchedGraph = R.compose(
    R.merge({type: actions.UPDATE_GRAPH}),
    normalize(aggregateMap)
)

export const fetchedGeojson = ({year, level, json}) => {
    const id = generateGeojsonID(year, level)
    return {
	type: actions.UPDATE_GEOJSON,
	entities: {
	    geojsons: {
		[id]: {
		    id,
		    year,
		    level,
		    json
		}
	    }
	}
    }
}



const getTitleForWpid = wpid => {
    const precinct = wpid % 1000
    const ward = (wpid - precinct) / 1000
    return `Ward: ${ward}, Precinct: ${precinct}`
}

const appendCandidateToPopup = (
    html, {candidate, votes, pct}
) => `${html}<br/> ${candidate}: ${votes} votes, ${pct}%`

const createZoneResultsPopup = ({level, zone, zoneCandidates}) => {
    
    const title = level === 'ward' ?
		  `Ward: ${zone}` :
		  getTitleForWpid(zone)

    const body = zoneCandidates.reduce(appendCandidateToPopup, '')

    return `<h3>${title}</h3>${body}`
}

export const fetchedZoneResults = zoneResults => ({
    type: actions.UPDATE_ZONE_RESULTS,
    entities: {
	popup: {
	    latlng: zoneResults.latlng,
	    timestamp: Date.now(),
	    html: createZoneResultsPopup(zoneResults)
	}
    }
})



const createGeocodePopup = ({
    street, ward, precinct
}) => `<h3>${street}</h3>
   <p>Ward: ${ward}<br/>
      Precinct: ${precinct}<br/>
      <small>Based on current (2015-) boundaries</small>
  </p>`

export const fetchedGeocode = geocode => ({
    type: actions.UPDATE_GEOCODE,
    entities: {
	popup: {
	    latlng: geocode.latlng,
	    timestamp: Date.now(),
	    html: createGeocodePopup(geocode)
	}
    }
})


