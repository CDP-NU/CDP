import L from 'leaflet'
import { takeLatest, throttle } from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'
import { LOAD_LEAFLET_MAP, SELECT_RACE, MAP_RACE, MAP_CANDIDATE } from '../actions.js'
import { fetchedRace } from '../creators.js'
import { fetchRaceInfo, fetchGeojson, fetchRaceHeatMap, fetchCandidateHeatMap } from './fetch.js'
import createMapStore from './mapStore.js'


function* validateGeojsonCache(store) {
    
    if(!store.cache.getCurrent()) {
	const {year, level} = store.cache

	const {data: json} = yield call(
	    fetchGeojson, year, level
	)

	store.cache.add(
	    {year, level, json}
	)	
    }
}

//5010

function* drawHeatMap(
    store, {year, level, heatMap}
) {

    const {zone_colors, legend} = heatMap
    
    store.geojsonLayer.setZoneColorSource(
	zone_colors
    )

    store.cache.select({
	year: year,
	level
    })

    store.legend.setEntries(legend)

    yield call(
	validateGeojsonCache, store
    )

    store.map.removeGeojsonLayer()
    store.geojsonLayer.useCurrentCacheGeojson()
    store.map.drawGeojson()
}




function* handleMapRace(
    store, {data: {race, year, level}}
) {
    const {data: heatMap} = yield call(
	fetchRaceHeatMap, race, level
    )

    yield call(
	drawHeatMap,
	store,
	{
	    year,
	    level,
	    heatMap
	}
    )
}


//hillary 501001 bernie 501006 race 5010
function* handleMapCandidate(
    store, {data: {candidate, year, level}}
) {
    const {data: heatMap} = yield call(
	fetchCandidateHeatMap, candidate, level
    )

    yield call(
	drawHeatMap,
	store,
	{
	    year,
	    level,
	    heatMap
	}
    )
}

function* handleSelectRace(
    store, {data: {electionUrl, raceUrl}}
) {

    const {data: {node}} = yield take(
	LOAD_LEAFLET_MAP
    )
    store.map.drawMap(node)
    
    
    const level = 'ward'

    const {data} = yield call(
	fetchRaceInfo,
	electionUrl,
	raceUrl,
	level
    )
    
    const {
	year, date,
	election_type, id, name,
	candidates
    } = data.raceInfo

    const {heatMap} = data

    const race = {
	id, name, year,
	election_type
    }

    yield put(fetchedRace(race, candidates))

    yield call(
	drawHeatMap,
	store,
	{
	    year,
	    level,
	    heatMap
	}
    )
}

function* handleMapAction(store, action) {
    switch(action.type) {
	case SELECT_RACE:
	    yield call(
		handleSelectRace, store, action
	    )
	    break
	case MAP_RACE:
	    yield call(
		handleMapRace, store, action
	    )
	    break
	case MAP_CANDIDATE:
	    yield call(
		handleMapCandidate, store, action
	    )
    }
}


export default function* leafletSaga() {
    
    const store = createMapStore()
    
    yield throttle(
	500,
	[
	    SELECT_RACE,
	    MAP_RACE,
	    MAP_CANDIDATE
	],
	handleMapAction,
	store
    )
}
