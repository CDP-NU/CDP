import * as actions from './actions'
import {checkStateFor, errorOf} from './utility'

const mapActions = [
    actions.REQUEST_RACE_WARD_MAP,
    actions.REQUEST_RACE_PRECINCT_MAP,
    actions.REQUEST_CANDIDATE_WARD_MAP,
    actions.REQUEST_CANDIDATE_PRECINCT_MAP
]


export const autocomplete = (action$, _, {getJSON}) => action$ 
    .ofType(actions.REQUEST_AUTOCOMPLETIONS)
    .pluck('request', 'keyword')
    .debounceTime(300)
    .filter(keyword => !!keyword.trim() && keyword.length > 2)
    .switchMap(
	keyword => getJSON(`/autocomplete/${keyword}`)
	    .map(
		entities => ({
		    type: actions.FETCHED_AUTOCOMPLETIONS,
		    data: {keyword},
		    entities
		})
	    ).catch(errorOf(actions.REQUEST_AUTOCOMPLETIONS))
    )

export const search = (action$, _, {post}) => action$ 
    .ofType(actions.REQUEST_SEARCH_RESULTS)
    .pluck('request')
    .throttleTime(200)
    .switchMap(
	({timestamp, searchForm}) => post(`/search`, searchForm)
	    .map(
		searchResults => ({
		    type: actions.FETCHED_SEARCH_RESULTS,
		    data: {timestamp, searchForm},
		    entities: {searchResults}
		})
	    ).catch(errorOf(actions.REQUEST_SEARCH_RESULTS))
    )



export const raceWardMap = (action$, state, {getJSON}) => action$
    .ofType(actions.REQUEST_RACE_WARD_MAP)
    .let(
	checkStateFor(state, ({race}) => ({
	    race,
	    candidates: race,
	    raceWardMap: race
	}))
    ).switchMap(
	({race, neededEntities}) => getJSON(
	    `/race/${race}/wards/map`, neededEntities
	).map(
	    entities => ({
		type: actions.FETCHED_RACE_WARD_MAP,
		data: {race},
		entities
	    })
	).catch(errorOf(actions.REQUEST_RACE_WARD_MAP))
    )

export const raceWardGraph = (action$, state, {getJSON}) => action$
    .ofType(actions.REQUEST_RACE_WARD_GRAPH)
    .let(
	checkStateFor(state, ({race}) => ({
	    race,
	    candidates: race,
	    raceWardMap: race,
	    raceWardStats: race
	}))
    ).switchMap(
	({race, neededEntities}) => getJSON(
	    `/race/${race}/wards/graph`, neededEntities
	).map(
	    entities => ({
		type: actions.FETCHED_RACE_WARD_GRAPH,
		data: {race},
		entities
	    })
	).catch(errorOf(actions.REQUEST_RACE_WARD_GRAPH))
    )

export const racePrecinctMap = (action$, state, {getJSON}) => action$
    .ofType(actions.REQUEST_RACE_PRECINCT_MAP)
    .let(
	checkStateFor(state, ({race}) => ({
	    race,
	    candidates: race,
	    racePrecinctMap: race
	}))
    ).switchMap(
	({race, neededEntities}) => getJSON(
	    `/race/${race}/precincts/map`, neededEntities
	).map(
	    entities => ({
		type: actions.FETCHED_RACE_PRECINCT_MAP,
		data: {race},
		entities
	    })
	).catch(errorOf(actions.REQUEST_RACE_PRECINCT_MAP))
    )



export const candidateWardMap = (action$, state, {getJSON}) => action$
    .ofType(actions.REQUEST_CANDIDATE_WARD_MAP)
    .let(
	checkStateFor(state, ({race, candidate}) => ({
	    race,
	    candidates: race,
	    candidateWardMap: candidate
	}))
    ).switchMap(
	({race, candidate, neededEntities}) => getJSON(
	    `/candidate/${candidate}/wards/map`, neededEntities
	).map(
	    entities => ({
		type: actions.FETCHED_CANDIDATE_WARD_MAP,
		data: {race, candidate},
		entities
	    })
	).catch(errorOf(actions.REQUEST_CANDIDATE_WARD_MAP))
    )

export const candidatePrecinctMap = (action$, state, {getJSON}) => action$
    .ofType(actions.REQUEST_CANDIDATE_PRECINCT_MAP)
    .let(
	checkStateFor(state, ({race, candidate}) => ({
	    race,
	    candidates: race,
	    candidatePrecinctMap: candidate
	}))
    ).switchMap(
	({race, candidate, neededEntities}) => getJSON(
	    `/candidate/${candidate}/precincts/map`, neededEntities
	).map(
	    entities => ({
		type: actions.FETCHED_CANDIDATE_PRECINCT_MAP,
		data: {race, candidate},
		entities
	    })
	).catch(errorOf(actions.REQUEST_CANDIDATE_PRECINCT_MAP))
    )



export const geojson = (action$, state, {getFile}) => action$
    .ofType(...mapActions)
    .let(
	checkStateFor(state, ({geojson}) => ({
	    geojson
	}))
    ).switchMap(
	({geojson: id}) => getFile(`/geojson/${id}`)
	    .map(
		geojson => ({
		    type: actions.FETCHED_GEOJSON,
		    data: {geojson: id},
		    entities: {geojson}
		})
	    ).catch(errorOf(actions.REQUEST_GEOJSON))
    )

export const geocode = (action$, _, {getJSON}) => action$
    .ofType(actions.REQUEST_GEOCODE)
    .pluck('request', 'street')
    .switchMap(
	street => getJSON(`/geocode/${street}`)
	    .map( geocode => ({
		type: actions.FETCHED_GEOCODE,
		data: {street},
		entities: {geocode}
	    }))
	    .catch(errorOf(actions.REQUEST_GEOCODE))
    )

export const ward = (action$, _, {getJSON}) => action$
    .ofType(actions.REQUEST_WARD)
    .pluck('request')
    .switchMap( ({timestamp, race, ward}) => getJSON(`/race/${race}/ward/${ward}`)
	.map( data => ({
	    type: actions.FETCHED_WARD,
	    data: {timestamp, race, ward},
	    entities: {ward: data}
	}))
	.catch(errorOf(actions.REQUEST_WARD))
	.takeUntil(action$.ofType(...mapActions))
    )

export const precinct = (action$, _, {getJSON}) => action$
    .ofType(actions.REQUEST_PRECINCT)
    .pluck('request')
    .switchMap(
	({timestamp, race, wpid}) => getJSON(`/race/${race}/precinct/${wpid}`)
	    .map(
		data => ({
		    type: actions.FETCHED_PRECINCT,
		    data: {timestamp, race, wpid},
		    entities: {precinct: data}
		})
	    ).catch(errorOf(actions.REQUEST_PRECINCT))
	    .takeUntil(action$.ofType(...mapActions))
    )
